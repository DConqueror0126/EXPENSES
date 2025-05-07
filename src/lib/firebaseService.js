import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const firebaseService = () => {
  const createDocument = async (col, data) => {
    const docRef = await addDoc(collection(db, col), data);
    return { id: docRef.id, ...data };
  };

  const getDocuments = async (col) => {
    const snapshot = await getDocs(collection(db, col));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const deleteDocuments = async (col, ids) => {
    const deletePromises = ids.map(id => deleteDoc(doc(db, col, id)));
    await Promise.all(deletePromises);
  };

  const updateDocument = async (col, id, updatedData) => {
    await updateDoc(doc(db, col, id), updatedData);
  };

  return {
    createTask: (data) => createDocument('tasks', data),
    getTasks: () => getDocuments('tasks'),

    createExpense: (data) => createDocument('expenses', data),
    getExpenses: () => getDocuments('expenses'),
    deleteExpenses: (ids) => deleteDocuments('expenses', ids),
    updateExpense: (id, updatedData) => updateDocument('expenses', id, updatedData), // Handles month field

    createAmount: (data) => createDocument('amounts', data),
    getAmounts: () => getDocuments('amounts'),

    createPlan: (data) => createDocument('plans', data),
    getPlans: () => getDocuments('plans'),
    deletePlans: (ids) => deleteDocuments('plans', ids),
    updatePlan: (id, updatedData) => updateDocument('plans', id, updatedData),
  };
};
