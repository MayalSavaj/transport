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
    children: [
      {
        name: "Order List",
        path: "/admin/orders"
      },
      {
        name: "Order Create",
        path: "/admin/orders/create"
      }
    ]
  },
  {
    name: "Party Payments",
    icon: duotone.Products,
    children: [
      {
        name: "Party Payment List",
        path: "/admin/party-payment"
      }
      // {
      //   name: "Create Party Payment",
      //   path: "/admin/party-payment/create"
      // }
    ]
  },
  {
    name: "Supplier Payments",
    icon: duotone.Accounts,
    children: [
      {
        name: "Supplier Payment List",
        path: "/admin/supplier-payment"
      }
      // {
      //   name: "Create Supplier Payment",
      //   path: "/admin/supplier-payment/create"
      // }
    ]
  },
  {
    type: "label",
    label: "Master"
  },
  {
    name: "Partys",
    icon: duotone.Customers,
    children: [
      {
        name: "Party List",
        path: "/admin/Partys"
      },
      {
        name: "Create Party",
        path: "/admin/Partys/create"
      }
    ]
  },
  {
    name: "Suppliers",
    icon: duotone.Seller,
    children: [
      {
        name: "Supplier List",
        path: "/admin/suppliers"
      },
      {
        name: "Create Supplier",
        path: "/admin/suppliers/create"
      }
    ]
  },
  {
    name: "Number Series",
    icon: duotone.Apps,
    children: [
      {
        name: "Number Series List",
        path: "/admin/number-series"
      },
      {
        name: "Create Number Series",
        path: "/admin/number-series/create"
      }
    ]
  },
  {
    name: "L&C",
    icon: duotone.Apps,
    children: [
      {
        name: "L&C List",
        path: "/admin/l&c"
      },
      {
        name: "Create L&C",
        path: "/admin/l&c/create"
      }
    ]
  },
  {
    type: "label",
    label: "Reports"
  },
  {
    name: "P&L",
    icon: duotone.Apps,
    children: [
      {
        name: "P&L List",
        path: "/p&l"
      },
      {
        name: "Create P&L",
        path: "/p&l/create"
      }
    ]
  },
  {
    name: "Logout",
    icon: duotone.Session,
    path: "/"
  }
];
