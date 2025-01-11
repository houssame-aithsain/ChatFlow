export const NotificationSystem = (message, type, setNotifications) => {
    console.log("Notification System: ", message);
    const removeNotification = (id, setNotifications) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };
    const addNotification = (message, type = "info", setNotifications) => {
        const id = Date.now(); // Unique ID
        setNotifications((prev) => [...prev, { id, message, type }]);
        // Auto-remove notification after 5 seconds
        setTimeout(() => removeNotification(id, setNotifications), 3000);
    };

    addNotification(message, type, setNotifications);
};
