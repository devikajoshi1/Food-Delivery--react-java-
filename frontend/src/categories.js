// Food shown in the "What's on your mind?" row.
// "dish" is the word we search for in menu item names.
const img = (id) => `https://images.unsplash.com/photo-${id}?w=200&h=200&fit=crop`

const categories = [
  { name: 'Samosa', dish: 'samosa', image: img('1601050690597-df0568f70950') },
  { name: 'Pizza', dish: 'pizza', image: img('1513104890138-7c749659a591') },
  { name: 'Biryani', dish: 'biryani', image: img('1563379091339-03b21ab4a4f8') },
  { name: 'Burger', dish: 'burger', image: img('1568901346375-23c9450c58cd') },
  { name: 'Dosa', dish: 'dosa', image: img('1630383249896-424e482df921') },
  { name: 'Paneer', dish: 'paneer', image: img('1567188040759-fb8a883dc6d8') },
  { name: 'Noodles', dish: 'noodles', image: img('1585032226651-759b368d7246') },
  { name: 'Pav Bhaji', dish: 'pav bhaji', image: img('1606491956689-2ea866880c84') },
  { name: 'Cake', dish: 'cake', image: img('1578985545062-69928b1d9587') },
  { name: 'Ice Cream', dish: 'ice cream', image: img('1497034825429-c343d7c6a68f') },
]

export default categories
