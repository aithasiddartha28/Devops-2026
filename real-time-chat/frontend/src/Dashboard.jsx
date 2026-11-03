import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:5000" : "");
const getRoom = (conversation, userId) => {
  if (conversation.type === "group") return conversation.group._id;
  if (conversation.type === "direct") {
    return `direct:${[userId, conversation.user._id].sort().join(":")}`;
  }
  return "general";
};

const request = async (path, options = {}, token) => {
  const { headers = {}, ...requestOptions } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

const formatTime = (date) => date ? new Date(date).toLocaleString() : "No activity yet";
const getClearBeforeKey = (userId, chatRoom) =>
  `chatconnect:clear-before:${userId}:${chatRoom}`;
const csvValue = (value) => {
  const text = String(value ?? "");
  const spreadsheetSafe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${spreadsheetSafe.replace(/"/g, '""')}"`;
};

const downloadReportsCsv = (reports) => {
  const sections = [
    ["Membership Participation", ["Group", "Members", "Member names"],
      reports.membershipParticipation.map((row) => [row.group, row.members, row.memberNames.join("; ")])],
    ["Group Activity", ["Group", "Messages", "Last active"],
      reports.groupActivity.map((row) => [row.group, row.messages, formatTime(row.lastActive)])],
    ["User Activity", ["User", "Email", "Role", "Messages", "Last active"],
      reports.userActivity.map((row) => [row.username, row.email, row.role, row.messages, formatTime(row.lastActive)])],
    ["Group Creation", ["Group", "Created by", "Created", "Members"],
      reports.groupCreation.map((row) => [row.name, row.createdBy, formatTime(row.createdAt), row.members])]
  ];
  const csv = sections.map(([title, headers, rows]) => [
    csvValue(title),
    headers.map(csvValue).join(","),
    ...rows.map((row) => row.map(csvValue).join(","))
  ].join("\n")).join("\n\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "chatconnect-reports.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

function Dashboard({ user, onLogout }) {
  const [screen, setScreen] = useState("overview");
  const [conversation, setConversation] = useState({ type: "general" });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupMemberToAdd, setGroupMemberToAdd] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [accountRole, setAccountRole] = useState(user.role);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const roomRef = useRef("general");
  const isAdmin = user.role === "admin";
  const activeRoom = getRoom(conversation, user.id);
  roomRef.current = activeRoom;
  const chatTitle = conversation.type === "group"
    ? conversation.group.name
    : conversation.type === "direct"
      ? conversation.user.username
      : "General Chat";

  const refreshProfile = async () => {
    const profile = await request(`/api/users/${user.id}`, {}, user.accessToken);
    setContacts(profile.contacts || []);
  };

  useEffect(() => {
    let active = true;
    const socket = io(API_URL, {
      autoConnect: false,
      auth: { token: user.accessToken }
    });
    socketRef.current = socket;

    socket.on("connect", () => setSocketReady(true));
    socket.on("disconnect", () => setSocketReady(false));
    socket.on("connect_error", (connectionError) => setError(connectionError.message));
    socket.on("receive_message", (incoming) => {
      if (incoming.chatRoom === roomRef.current) {
        const clearBefore = Number(
          localStorage.getItem(getClearBeforeKey(user.id, incoming.chatRoom))
        ) || 0;
        if (new Date(incoming.createdAt).getTime() <= clearBefore) return;
        setMessages((current) => [...current, incoming]);
      }
    });
    socket.on("new_notification", (notification) => {
      setNotifications((current) => [
        { ...notification, id: `${Date.now()}-${Math.random()}`, read: false },
        ...current
      ]);
    });
    socket.on("group_membership_updated", async ({ groupId, action }) => {
      try {
        const updatedGroups = await request(`/api/groups/${user.id}`, {}, user.accessToken);
        setGroups(updatedGroups);
        if (action === "removed" && roomRef.current === groupId) {
          setConversation({ type: "general" });
          setScreen("chats");
          setError("You no longer have access to that group.");
        }
      } catch (membershipError) {
        setError(membershipError.message);
      }
    });
    socket.on("group_deleted", ({ groupId, groupName }) => {
      setGroups((current) => current.filter((group) => group._id !== groupId));
      if (roomRef.current === groupId) {
        setConversation({ type: "general" });
        setScreen("chats");
      }
      setError(`The group "${groupName}" was deleted by its administrator.`);
    });
    socket.connect();

    Promise.all([
      request(`/api/groups/${user.id}`, {}, user.accessToken),
      request("/api/users", {}, user.accessToken),
      request(`/api/users/${user.id}`, {}, user.accessToken)
    ]).then(([loadedGroups, loadedUsers, profile]) => {
      if (!active) return;
      setGroups(loadedGroups);
      setUsers(loadedUsers.filter((item) => item._id !== user.id));
      setContacts(profile.contacts || []);
    }).catch((loadError) => {
      if (active) setError(loadError.message);
    });

    return () => {
      active = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user.id, user.accessToken]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return undefined;

    setMessages([]);
    setChatLoading(true);
    let active = true;
    const clearBefore = Number(localStorage.getItem(getClearBeforeKey(user.id, activeRoom))) || 0;
    socket.emit("join_room", activeRoom, (result) => {
      if (result?.error && active) setError(result.error);
    });

    request(`/api/messages?chatRoom=${encodeURIComponent(activeRoom)}`, {}, user.accessToken)
      .then((history) => {
        if (active) {
          setMessages(() => {
            const messagesById = new Map(
              history
                .filter((item) => new Date(item.createdAt).getTime() > clearBefore)
                .map((item) => [item._id, item])
            );
            return [...messagesById.values()].sort(
              (left, right) => new Date(left.createdAt) - new Date(right.createdAt)
            );
          });
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setChatLoading(false);
      });

    return () => {
      active = false;
      socket.emit("leave_room", activeRoom);
    };
  }, [activeRoom, user.id, user.accessToken, socketReady]);

  useEffect(() => {
    if (screen !== "reports" || !isAdmin) return;
    request("/api/reports", {}, user.accessToken)
      .then(setReports)
      .catch((reportError) => setError(reportError.message));
  }, [screen, isAdmin, user.accessToken]);

  useEffect(() => {
    if (screen !== "groups" && screen !== "contacts") return undefined;
    let active = true;

    Promise.all([
      request("/api/users", {}, user.accessToken),
      screen === "groups"
        ? request(`/api/groups/${user.id}`, {}, user.accessToken)
        : Promise.resolve(null)
    ]).then(([latestUsers, latestGroups]) => {
      if (!active) return;
      setUsers(latestUsers);
      if (latestGroups) setGroups(latestGroups);
    }).catch((loadError) => {
      if (active) setError(loadError.message);
    });

    return () => {
      active = false;
    };
  }, [screen, user.id, user.accessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chooseGeneralChat = () => {
    setConversation({ type: "general" });
    setScreen("chats");
  };

  const openGroup = (group) => {
    setConversation({ type: "group", group });
    setScreen("chats");
  };

  const openDirectChat = (contact) => {
    setConversation({ type: "direct", user: contact });
    setScreen("chats");
  };

  const openNotificationChat = async (notification) => {
    if (notification.chatRoom === "general") {
      chooseGeneralChat();
    } else if (notification.chatRoom.startsWith("direct:")) {
      const participantId = notification.chatRoom
        .slice("direct:".length)
        .split(":")
        .find((id) => id !== user.id);
      let contact = contacts.find((item) => item._id === participantId);

      try {
        if (!contact) {
          contact = await request(`/api/users/${participantId}`, {}, user.accessToken);
          setUsers((current) => current.some((item) => item._id === contact._id)
            ? current
            : [...current, contact]);
        }
        openDirectChat(contact);
        setNotifications((current) => current.filter((item) => item.id !== notification.id));
      } catch (openError) {
        setError(openError.message);
      }
    } else {
      try {
        const latestGroups = await request(`/api/groups/${user.id}`, {}, user.accessToken);
        setGroups(latestGroups);
        const group = latestGroups.find((item) => item._id === notification.chatRoom);
        if (!group) {
          setError("You no longer have access to that group.");
          return;
        }
        openGroup(group);
        setNotifications((current) => current.filter((item) => item.id !== notification.id));
      } catch (openError) {
        setError(openError.message);
      }
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim() || !socketRef.current) return;
    setError("");
    socketRef.current.emit("send_message", {
      text: message.trim(),
      chatRoom: activeRoom
    }, (result) => {
      if (result?.error) setError(result.error);
    });
    setMessage("");
  };

  const clearChat = () => {
    if (!window.confirm(`Clear ${chatTitle} messages from your view only? Other members will still see them.`)) {
      return;
    }
    localStorage.setItem(getClearBeforeKey(user.id, activeRoom), String(Date.now()));
    setMessages([]);
    setError("");
  };

  const createGroup = async (event) => {
    event.preventDefault();
    if (!groupName.trim()) return;

    try {
      const group = await request("/api/groups", {
        method: "POST",
        body: JSON.stringify({
          name: groupName.trim(),
          description: groupDescription.trim()
        })
      }, user.accessToken);
      setGroups((current) => [
        group,
        ...current.filter((item) => item._id !== group._id)
      ]);
      if (user.role === "user") setAccountRole("groupAdmin");
      setGroupName("");
      setGroupDescription("");
      setError("");
    } catch (createError) {
      setError(createError.message);
    }
  };

  const addContact = async (contactId) => {
    try {
      await request(`/api/users/${user.id}/contacts`, {
        method: "POST",
        body: JSON.stringify({ contactId })
      }, user.accessToken);
      await refreshProfile();
      setError("");
    } catch (contactError) {
      setError(contactError.message);
    }
  };

  const removeContact = async (contactId) => {
    try {
      await request(`/api/users/${user.id}/contacts/${contactId}`, { method: "DELETE" }, user.accessToken);
      await refreshProfile();
      setError("");
    } catch (contactError) {
      setError(contactError.message);
    }
  };

  const changeMembership = async (group, memberId, action) => {
    try {
      const updatedGroup = await request(
        action === "add"
          ? `/api/groups/${group._id}/members`
          : `/api/groups/${group._id}/members/${memberId}`,
        {
          method: action === "add" ? "POST" : "DELETE",
          body: JSON.stringify(action === "add"
            ? { memberId }
            : {})
        },
        user.accessToken
      );
      setGroups((current) => current.map((item) =>
        item._id === updatedGroup._id ? updatedGroup : item
      ));
      if (conversation.type === "group" && conversation.group._id === updatedGroup._id) {
        setConversation({ type: "group", group: updatedGroup });
      }
      setGroupMemberToAdd("");
      setError("");
    } catch (membershipError) {
      setError(membershipError.message);
    }
  };

  const deleteGroup = async (group) => {
    if (!window.confirm(`Delete "${group.name}" and all its messages for everyone? This cannot be undone.`)) {
      return;
    }

    try {
      await request(`/api/groups/${group._id}`, { method: "DELETE" }, user.accessToken);
      setGroups((current) => current.filter((item) => item._id !== group._id));
      if (conversation.type === "group" && conversation.group._id === group._id) {
        setConversation({ type: "general" });
        setScreen("chats");
      }
      setError("");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const visibleUsers = users.filter((item) =>
    `${item.username} ${item.email}`.toLowerCase().includes(search.toLowerCase())
  );
  const contactIds = new Set(contacts.map((contact) => contact._id));
  const reportTable = (title, columns, rows) => (
    <section className="report-card">
      <h3>{title}</h3>
      <div className="table-scroll">
        <table>
          <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
          <tbody>
            {rows?.length
              ? rows.map((row, index) => (
                <tr key={`${title}-${index}`}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex}>{Array.isArray(value) ? value.join(", ") : value ?? "—"}</td>
                  ))}
                </tr>
              ))
              : <tr><td colSpan={columns.length}>No data available yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setScreen("overview"); }}>
          <span className="brand-mark">C</span>
          <span>ChatConnect<small>REAL-TIME COMMUNICATION</small></span>
        </a>
        <div className="header-account">
          <div className="avatar">{user.username?.[0]?.toUpperCase()}</div>
          <div><strong>{user.username}</strong><small>{accountRole}</small></div>
          <button className="button button-outline" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <div className="dashboard-shell">
        <aside className="app-sidebar">
          <p className="nav-label">WORKSPACE</p>
          <button className={screen === "overview" ? "nav-item active" : "nav-item"} onClick={() => setScreen("overview")}><span>⌂</span>Overview</button>
          <button className={screen === "chats" ? "nav-item active" : "nav-item"} onClick={chooseGeneralChat}><span>◷</span>Messages</button>
          <button className={screen === "contacts" ? "nav-item active" : "nav-item"} onClick={() => setScreen("contacts")}><span>♧</span>Contacts</button>
          <button className={screen === "groups" ? "nav-item active" : "nav-item"} onClick={() => setScreen("groups")}><span>◎</span>Groups</button>
          <button className={screen === "notifications" ? "nav-item active" : "nav-item"} onClick={() => setScreen("notifications")}><span>♢</span>Notifications{notifications.length > 0 && <em>{notifications.length}</em>}</button>
          {isAdmin && <button className={screen === "reports" ? "nav-item active" : "nav-item"} onClick={() => setScreen("reports")}><span>▤</span>Reports</button>}
          <div className="sidebar-bottom">
            <p className="nav-label">YOUR ACCOUNT</p>
            <button className={screen === "profile" ? "nav-item active" : "nav-item"} onClick={() => setScreen("profile")}><span>⚙</span>Profile & settings</button>
            <div className="sidebar-user">
              <div className="avatar">{user.username?.[0]?.toUpperCase()}</div>
              <div><strong>{user.username}</strong><small>{user.email}</small></div>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {error && <div className="feedback error" role="alert">{error}<button onClick={() => setError("")}>Dismiss</button></div>}

          {screen === "overview" && (
            <div className="page-content">
              <div className="page-heading">
                <div><p className="eyebrow">YOUR WORKSPACE</p><h1>Good to see you, {user.username}</h1><p>Keep up with your conversations and community.</p></div>
                <button className="button button-primary" onClick={chooseGeneralChat}>Open messages <span>→</span></button>
              </div>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-icon blue">◷</span><p>Conversations</p><strong>{contacts.length + groups.length + 1}</strong><small>Including general chat</small></article>
                <article className="stat-card"><span className="stat-icon purple">◎</span><p>Your groups</p><strong>{groups.length}</strong><small>Groups you belong to</small></article>
                <article className="stat-card"><span className="stat-icon green">♧</span><p>Your contacts</p><strong>{contacts.length}</strong><small>People in your network</small></article>
              </div>
              <section className="panel recent-panel">
                <div className="panel-heading"><div><h2>Quick conversations</h2><p>Jump back into a chat.</p></div></div>
                <button className="conversation-row" onClick={chooseGeneralChat}><span className="conversation-icon general-icon">#</span><span><strong>General Chat</strong><small>Community conversation</small></span><span className="row-arrow">→</span></button>
                {contacts.slice(0, 4).map((contact) => <button className="conversation-row" key={contact._id} onClick={() => openDirectChat(contact)}><span className="avatar small-avatar">{contact.username[0].toUpperCase()}</span><span><strong>{contact.username}</strong><small>Direct message</small></span><span className="row-arrow">→</span></button>)}
                {groups.slice(0, 4).map((group) => <button className="conversation-row" key={group._id} onClick={() => openGroup(group)}><span className="conversation-icon group-icon">◎</span><span><strong>{group.name}</strong><small>{group.members?.length || 0} members · group</small></span><span className="row-arrow">→</span></button>)}
                {!contacts.length && !groups.length && <p className="empty-note">Add a contact or create a group to get started.</p>}
              </section>
            </div>
          )}

          {screen === "chats" && (
            <div className="chat-layout">
              <aside className="conversation-sidebar">
                <div className="conversation-title"><h2>Messages</h2><p>Your conversations</p></div>
                <p className="nav-label">COMMUNITY</p>
                <button className={`conversation-choice ${conversation.type === "general" ? "selected" : ""}`} onClick={chooseGeneralChat}><span className="conversation-icon general-icon">#</span><span>General Chat</span></button>
                {contacts.length > 0 && <><p className="nav-label">DIRECT MESSAGES</p>{contacts.map((contact) => <button className={`conversation-choice ${conversation.type === "direct" && conversation.user._id === contact._id ? "selected" : ""}`} key={contact._id} onClick={() => openDirectChat(contact)}><span className="avatar small-avatar">{contact.username[0].toUpperCase()}</span><span>{contact.username}</span></button>)}</>}
                {groups.length > 0 && <><p className="nav-label">GROUPS</p>{groups.map((group) => <button className={`conversation-choice ${conversation.type === "group" && conversation.group._id === group._id ? "selected" : ""}`} key={group._id} onClick={() => openGroup(group)}><span className="conversation-icon group-icon">◎</span><span>{group.name}</span></button>)}</>}
                <button className="new-chat-link" onClick={() => setScreen("contacts")}>＋ Find people</button>
              </aside>
              <section className="chat-panel">
                <div className="chat-heading"><div><h2>{chatTitle}</h2><p>{conversation.type === "group" ? `${conversation.group.members?.length || 0} members` : conversation.type === "direct" ? "Direct conversation" : "Everyone in the community"}</p></div><div className="chat-actions">{conversation.type === "group" && <button className="button button-outline" onClick={() => setScreen("groups")}>Manage group</button>}<button className="button button-outline" onClick={clearChat}>Clear chat</button></div></div>
                <div className="messages" aria-live="polite">
                  {chatLoading && <p className="empty-chat">Loading messages…</p>}
                  {!chatLoading && messages.length === 0 && <div className="empty-chat"><span>✦</span><strong>No messages yet</strong><p>Start the conversation with a friendly hello.</p></div>}
                  {messages.map((item) => (
                    <article className={`message-item ${String(item.sender) === user.id ? "own-message" : ""}`} key={item._id}>
                      <div className="message-avatar">{item.username?.[0]?.toUpperCase()}</div>
                      <div className="message-body"><div className="message-meta"><strong>{String(item.sender) === user.id ? "You" : item.username}</strong><time>{formatTime(item.createdAt)}</time></div><p>{item.text}</p>{String(item.sender) === user.id && <small className="delivery-status">{item.status === "delivered" ? "Delivered" : "Sent"}</small>}</div>
                    </article>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form className="message-form" onSubmit={sendMessage}><input aria-label="Message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={`Message ${chatTitle}…`} maxLength={2000}/><button className="button button-primary" type="submit" disabled={!message.trim()}>Send <span>↑</span></button></form>
                <p className="input-hint">Be kind. Messages are limited to 2,000 characters.</p>
              </section>
            </div>
          )}

          {screen === "contacts" && (
            <div className="page-content">
              <div className="page-heading"><div><p className="eyebrow">YOUR NETWORK</p><h1>Contacts</h1><p>Find people and start a private conversation.</p></div></div>
              <div className="toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email…" aria-label="Search users"/><span>{visibleUsers.length} people</span></div>
              <div className="people-grid">{visibleUsers.map((person) => {
                const isContact = contactIds.has(person._id);
                return <article className="person-card" key={person._id}><div className="person-identity"><div className="avatar person-avatar">{person.username[0].toUpperCase()}</div><div><strong>{person.username}</strong><small>{person.email}</small></div></div><span className="role-badge">{person.role}</span><div className="person-actions">{isContact ? <><button className="button button-primary" onClick={() => openDirectChat(person)}>Message</button><button className="text-button" onClick={() => removeContact(person._id)}>Remove</button></> : <button className="button button-outline" onClick={() => addContact(person._id)}>＋ Add contact</button>}</div></article>;
              })}{visibleUsers.length === 0 && <p className="empty-note">No people match your search.</p>}</div>
            </div>
          )}

          {screen === "groups" && (
            <div className="page-content">
              <div className="page-heading"><div><p className="eyebrow">COMMUNITIES</p><h1>Groups</h1><p>Create a group, invite people, and manage membership.</p></div></div>
              <section className="panel create-group-panel"><div><h2>Create a group</h2><p>Group creators can manage the member list.</p></div><form onSubmit={createGroup} className="create-group-form"><input value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Group name" maxLength={60} required/><input value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)} placeholder="Description (optional)" maxLength={160}/><button className="button button-primary">Create group</button></form></section>
              <div className="section-title"><h2>Your groups</h2><span>{groups.length} total</span></div>
              <div className="group-grid">{groups.map((group) => {
                const ownerId = typeof group.createdBy === "object" ? group.createdBy._id : group.createdBy;
                const canManage = isAdmin || ownerId === user.id;
                return <article className="group-card" key={group._id}><div className="group-card-heading"><span className="conversation-icon group-icon">◎</span><span className="group-owner">{canManage ? "ADMIN" : "MEMBER"}</span></div><h3>{group.name}</h3><p>{group.description || "A place for your group to connect."}</p><div className="member-list"><strong>Members ({group.members?.length || 0})</strong>{group.members?.map((member) => <div className="member-row" key={member._id}><span className="avatar tiny-avatar">{member.username?.[0]?.toUpperCase()}</span><span>{member.username}{member._id === ownerId && <small> · owner</small>}</span>{canManage && member._id !== ownerId && <button className="text-button danger-text" onClick={() => changeMembership(group, member._id, "remove")}>Remove</button>}</div>)}</div>{canManage && <div className="add-member-row"><select value={groupMemberToAdd} onChange={(event) => setGroupMemberToAdd(event.target.value)} aria-label={`Add member to ${group.name}`}><option value="">Select a person…</option>{users.filter((person) => !group.members?.some((member) => member._id === person._id)).map((person) => <option key={person._id} value={person._id}>{person.username}</option>)}</select><button className="button button-outline" disabled={!groupMemberToAdd} onClick={() => changeMembership(group, groupMemberToAdd, "add")}>Add</button></div>}{!canManage && ownerId !== user.id && <button className="text-button danger-text leave-group" onClick={() => changeMembership(group, user.id, "remove")}>Leave group</button>}{canManage && <button className="text-button danger-text delete-group" onClick={() => deleteGroup(group)}>Delete group</button>}<button className="button button-primary group-chat-button" onClick={() => openGroup(group)}>Open group chat <span>→</span></button></article>;
              })}{groups.length === 0 && <p className="empty-note">You haven’t joined any groups. Create one above to get started.</p>}</div>
            </div>
          )}

          {screen === "notifications" && (
            <div className="page-content">
              <div className="page-heading"><div><p className="eyebrow">STAY IN THE LOOP</p><h1>Notifications</h1><p>Updates about messages and conversations.</p></div><button className="button button-outline" onClick={() => setNotifications([])} disabled={!notifications.length}>Clear all</button></div>
              <section className="panel notification-list">{notifications.length ? notifications.map((item) => <article className="notification-row" key={item.id}><button className="notification-open" onClick={() => openNotificationChat(item)} aria-label={`Open chat: ${item.text}`}><span className="stat-icon blue">◷</span><span className="notification-copy"><strong>{item.text}</strong><small>{formatTime(item.createdAt)}</small></span><span className="notification-view">Open chat →</span></button><button className="text-button" onClick={() => setNotifications((current) => current.filter((entry) => entry.id !== item.id))}>Dismiss</button></article>) : <div className="empty-state"><span>♢</span><strong>You’re all caught up</strong><p>New message notifications will appear here.</p></div>}</section>
            </div>
          )}

          {screen === "reports" && isAdmin && (
            <div className="page-content">
              <div className="page-heading"><div><p className="eyebrow">ADMINISTRATION</p><h1>Communication reports</h1><p>Membership, messaging activity, and group creation.</p></div>{reports && <div className="report-actions"><button className="button button-outline" onClick={() => downloadReportsCsv(reports)}>Export CSV</button><button className="button button-outline" onClick={() => window.print()}>Print</button></div>}</div>
              {reports ? <><div className="stat-grid report-stats"><article className="stat-card"><p>Total users</p><strong>{reports.totals.users}</strong></article><article className="stat-card"><p>Total groups</p><strong>{reports.totals.groups}</strong></article><article className="stat-card"><p>Total messages</p><strong>{reports.totals.messages}</strong></article></div><div className="report-grid">
                {reportTable("Membership Participation", ["Group", "Members", "Member names"], reports.membershipParticipation.map((row) => ({ group: row.group, members: row.members, names: row.memberNames })))}
                {reportTable("Group Activity", ["Group", "Messages", "Last active"], reports.groupActivity.map((row) => ({ group: row.group, messages: row.messages, lastActive: formatTime(row.lastActive) })))}
                {reportTable("User Activity", ["User", "Email", "Role", "Messages", "Last active"], reports.userActivity.map((row) => ({ username: row.username, email: row.email, role: row.role, messages: row.messages, lastActive: formatTime(row.lastActive) })))}
                {reportTable("Group Creation", ["Group", "Created by", "Created", "Members"], reports.groupCreation.map((row) => ({ name: row.name, createdBy: row.createdBy, createdAt: formatTime(row.createdAt), members: row.members })))}
              </div></> : <div className="panel loading-panel">Loading reports…</div>}
            </div>
          )}

          {screen === "profile" && (
            <div className="page-content">
              <div className="page-heading"><div><p className="eyebrow">YOUR ACCOUNT</p><h1>Profile & settings</h1><p>Your account information and access level.</p></div></div>
              <section className="panel profile-card"><div className="avatar profile-avatar">{user.username?.[0]?.toUpperCase()}</div><div><h2>{user.username}</h2><p>{user.email}</p><span className="role-badge">{accountRole}</span></div><button className="button button-outline" onClick={onLogout}>Log out</button></section>
              <section className="panel settings-note"><h2>Account controls</h2><p>Sign out to end this session. Group owners and administrators can manage group membership from the Groups page.</p>{isAdmin && <p className="admin-note">Administrator access is enabled for this account.</p>}</section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
