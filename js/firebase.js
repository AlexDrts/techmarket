import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const db = getFirestore(initializeApp(firebaseConfig));

export function saveOrder(order) {
  return addDoc(collection(db, "orders"), {
    orderId: order.id,
    customer: {
      name: order.customer.name,
      phone: order.customer.phone,
      email: order.customer.email
    },
    items: order.items.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
    total: order.getTotal(),
    city: order.city,
    delivery: order.delivery,
    gift: order.gift,
    insurance: order.insurance,
    status: order.status,
    createdAt: serverTimestamp()
  });
}
