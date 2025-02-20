// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    id: "e2c1ee0a-8aa4-4ed4-a362-0fdf20946a78",
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06T00:00:00Z',
  },
  {
    id: "2add7a54-f7b4-4c63-b2cf-6e2a9a5bcb2c",
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14T00:00:00Z',
  },
  {
    id: "c70a60f9-91f1-4df3-858e-920b8bcd1c68",
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29T00:00:00Z',
  },
  {
    id: "28818de9-c42e-4227-8b34-f7936afb7c83",
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10T00:00:00Z',
  },
  {
    id: "6ad1dda8-6af6-49ba-a35e-489069dfe0e0",
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05T00:00:00Z',
  },
  {
    id: "82c43330-4c08-40e7-a08b-eceecc4a72e1",
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16T00:00:00Z',
  },
  {
    id: "8b9c2edf-49ad-4314-a6cb-728fde0dbdc4",
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27T00:00:00Z',
  },
  {
    id: "3a837e2d-d8e4-45e0-8407-5491568114a6",
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09T00:00:00Z',
  },
  {
    id: "11c58cd5-40cb-47e3-9bf4-ed381bff20f7",
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17T00:00:00Z',
  },
  {
    id: "5af8ff1d-18a5-4b95-970b-f70506950558",
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07T00:00:00Z',
  },
  {
    id: "7be7bf90-48bd-49ce-b8c0-a8ed2ae23d42",
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19T00:00:00Z',
  },
  {
    id: "4485d2d6-faf3-4f4d-9f04-23b61cee2b98",
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03T00:00:00Z',
  },
  {
    id: "7ba23ee5-afbd-4f63-9378-35e34a63ed4f",
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05T00:00:00Z',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { users, customers, invoices, revenue };
