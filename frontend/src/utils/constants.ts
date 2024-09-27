export const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Transactions",
    href: "/transactions",
    submenu: [
      { name: "Completed", href: "/transactions/completed" },
      { name: "Pending", href: "/transactions/pending" },
    ],
  },
  {
    name: "Balance",
    href: "/balance",
  },
];
