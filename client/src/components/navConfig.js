export const navConfig = {
  seeker: {
    title: "Job Seeker",
    items: [
      { id: "dashboard", label: "Dashboard", path: "/seeker/view-jobs", icon: "🏠" },
      { id: "profile", label: "My Profile", path: "/seeker/profile", icon: "👤" },
      { id: "saved", label: "Saved Jobs", path: "/seeker/saved-jobs", icon: "💾" },
      { id: "applied", label: "Applied Jobs", path: "/seeker/applied-jobs", icon: "📝" },
      { id: "logout", label: "Logout", path: "/logout", icon: "🚪" }, 
    ],
  },
  employer: {
    title: "Employer",
    items: [
      { id: "dashboard", label: "Dashboard", path: "/employer/view-jobs", icon: "🏠" },
      { id: "profile", label: "My Profile", path: "/employer/profile", icon: "🏢" },
      { id: "create-job", label: "Create Job", path: "/employer/create-job", icon: "➕" },
      { id: "applications", label: "Applications", path: "/employer/view-applicants", icon: "📄" },
      { id: "logout", label: "Logout", path: "/logout", icon: "🚪" },
    ],
  },
  admin: {
    title: "Admin",
    items: [
      { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
      { id: "users", label: "Manage Users", path: "/admin/users", icon: "👥" },
      { id: "jobs", label: "Manage Jobs", path: "/admin/jobs", icon: "💼" },
      { id: "reports", label: "Reports", path: "/admin/reports", icon: "📊" },
      { id: "logout", label: "Logout", path: "/logout", icon: "🚪" },
    ],
  },
};