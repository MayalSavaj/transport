import duotone from "components/icons/duotone";

export const navigations = [
  {
    name: "Profile",
    icon: duotone.Customers,
    path: "/admin/profile",
  },
  {
    type: "label",
    label: "TransCation"
  },
  {
    name: "Orders",
    icon: duotone.Order,
    path: "/admin/orders"
    // children: [
    //   {
    //     name: "Order List",
    //     path: "/admin/orders"
    //   },
    //   {
    //     name: "Order Create",
    //     path: "/admin/orders/create"
    //   }
    // ]
  },
  {
    name: "Party Payments",
    icon: duotone.Products,
    path: "/admin/party-payment"

    // children: [
    //   {
    //     name: "Party Payment List",
    //     path: "/admin/party-payment"
    //   }
    // {
    //   name: "Create Party Payment",
    //   path: "/admin/party-payment/create"
    // }
    // ]
  },
  {
    name: "Supplier Payments",
    icon: duotone.Accounts,
    path: "/admin/supplier-payment"

    // children: [
    //   {
    //     name: "Supplier Payment List",
    //     path: "/admin/supplier-payment"
    //   }
    // {
    //   name: "Create Supplier Payment",
    //   path: "/admin/supplier-payment/create"
    // }
    // ]
  },
  {
    type: "label",
    label: "Master"
  },
  {
    name: "Partys",
    icon: duotone.Customers,
    path: "/admin/Partys"

    // children: [
    //   {
    //     name: "Party List",
    //     path: "/admin/Partys"
    //   },
    //   {
    //     name: "Create Party",
    //     path: "/admin/Partys/create"
    //   }
    // ]
  },
  {
    name: "Suppliers",
    icon: duotone.Seller,
    path: "/admin/suppliers"

    // children: [
    //   {
    //     name: "Supplier List",
    //     path: "/admin/suppliers"
    //   },
    //   {
    //     name: "Create Supplier",
    //     path: "/admin/suppliers/create"
    //   }
    // ]
  },
  {
    name: "Number Series",
    icon: duotone.Apps,
    path: "/admin/number-series"

    // children: [
    //   {
    //     name: "Number Series List",
    //     path: "/admin/number-series"
    //   },
    //   {
    //     name: "Create Number Series",
    //     path: "/admin/number-series/create"
    //   }
    // ]
  },
  {
    name: "T&C",
    icon: duotone.Apps,
    path: "/admin/l&c"

    // children: [
    //   {
    //     name: "L&C List",
    //     path: "/admin/l&c"
    //   },
    //   {
    //     name: "Create L&C",
    //     path: "/admin/l&c/create"
    //   }
    // ]
  },
  {
    type: "label",
    label: "Reports"
  },
  {
    name: "P&L",
    icon: duotone.Apps,
    path: "/admin/p&l"

    // children: [
    //   {
    //     name: "P&L List",
    //     path: "/admin/p&l"
    //   },
    //   {
    //     name: "Create P&L",
    //     path: "/p&l/create"
    //   }
    // ]
  },
  {
    name: "Logout",
    icon: duotone.Session,
    path: "/"
  }
];
