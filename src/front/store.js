export const initialStore = () => {
  return {
    profile: {
      name: "Nombre de Usuario",
      email: "correo@delusuario.com",
      presentation:
        "Breve presentación del usuario. Haz clic en 'Editar Perfil' para cambiar esto.",
      location: "Vive en Madrid",
      age: 26,
      phone: "666 000 666",
      gender: "Género sin especificar",
      social: {
        instagram: "usuario_ig",
        twitter: "usuario_tw",
        facebook: "usuario_fb",
      },
      avatar:
        "https://res.cloudinary.com/dmx0zjkej/image/upload/v1762540958/LOGO_600_x_600_muoehy.png",
    },
    clans: [
      {
        id: 1,
        name: "Los geek's",
        category: "Grupo de Trabajo",
        members: 4,
        created: "2025-11-03",
      },
      {
        id: 2,
        name: "Familia",
        category: "Familia",
        members: 3,
        created: "2025-10-01",
      },
      {
        id: 3,
        name: "Novia/o",
        category: "Social",
        members: 2,
        created: "2025-09-15",
      },
    ],
    activeClanId: 1,
    userTasks: [
      { id: 1, title: "Make the bed", completed: false },
      { id: 2, title: "Do my homework", completed: false },
      // Añadimos dos tareas más para que el contador "sin hacer" sea 4
      { id: 3, title: "Comprar comida", completed: false },
      { id: 4, title: "Llamar al banco", completed: false },
    ],
    clanTasks: [
      {
        id: 101,
        clanId: 1,
        title: "Terminar el proyecto final",
        completed: false,
      },
      {
        id: 102,
        clanId: 1,
        title: "Preparar la presentación",
        completed: false,
      },
      { id: 103, clanId: 1, title: "Revisar el backend", completed: true }, // <-- Tarea completada
      { id: 104, clanId: 2, title: "Comprar pan", completed: false },
    ],
    personalBote: 100.0,
    commonBote: {
      1: 150.0,
      2: 75.5,
      3: 200.0,
    },

    // 🔥 Recuperado del revert
    token: localStorage.getItem("token") || null,

    // Finanzas
    personalBote: 119.58,
    personalExpenses: [
      // <-- NUEVO: Para Finanzas Personales
      {
        id: 401,
        concept: "Café de la mañana",
        amount: 2.5,
        date: "2025-11-15",
      },
      { id: 402, concept: "Ticket de metro", amount: 1.5, date: "2025-11-14" },
    ],
    expenses: [
      // Gastos de Clan
      {
        id: 201,
        clanId: 1,
        concept: "Pizzas para reunión",
        amount: 35.5,
        paidBy: "Nombre de Usuario",
        date: "2025-11-10",
      },
      {
        id: 202,
        clanId: 1,
        concept: "Suscripción a servicio API",
        amount: 15.0,
        paidBy: "Amigo Uno",
        date: "2025-11-05",
      },
      {
        id: 203,
        clanId: 2,
        concept: "Compra supermercado",
        amount: 50.2,
        paidBy: "Familia",
        date: "2025-11-01",
      },
    ],
    balances: [
      { id: 301, clanId: 1, name: "Nombre de Usuario", amount: 15.0 },
      { id: 302, clanId: 1, name: "Amigo Uno", amount: -10.0 },
    ],
  };
};

// Reducer que maneja todas las acciones
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "ADD_USER_TASK":
      const newUserTask = {
        id: new Date().getTime(),
        title: action.payload.title,
        completed: false,
      };
      return {
        ...store,
        userTasks: [...store.userTasks, newUserTask],
      };

    case "TOGGLE_USER_TASK":
      return {
        ...store,
        userTasks: store.userTasks.map((task) => {
          return task.id === action.payload.taskId
            ? { ...task, completed: !task.completed }
            : task;
        }),
      };
    case "DELETE_USER_TASK":
      return {
        ...store,
        userTasks: store.userTasks.filter(
          (task) => task.id !== action.payload.taskId
        ),
      };

    // Acciones de Perfil
    case "UPDATE_PROFILE":
      return {
        ...store,
        profile: { ...store.profile, ...action.payload },
      };

    case "UPDATE_PERSONAL_BOTE":
      return {
        ...store,
        personalBote: parseFloat(action.payload.newBote),
      };

    // Acciones de Clanes / Grupos
    case "CREATE_CLAN":
      const newClan = {
        id: new Date().getTime(),
        ...action.payload,
        members: 1,
      };
      return {
        ...store,
        clans: [...store.clans, newClan],
      };

    case "JOIN_CLAN":
      console.log("Intentando unirse al clan con código:", action.payload.code);
      return store;

    case "SET_ACTIVE_CLAN":
      return {
        ...store,
        activeClanId: action.payload.clanId,
      };

    case "DELETE_CLAN":
      if (!store.activeClanId) return store;
      const remainingClans = store.clans.filter(
        (clan) => clan.id !== store.activeClanId
      );
      const remainingTasks = store.tasks.filter(
        (task) => task.clanId !== store.activeClanId
      );
      return {
        ...store,
        clans: remainingClans,
        tasks: remainingTasks,
        activeClanId: remainingClans.length > 0 ? remainingClans[0].id : null,
      };

    // Acciones de Tareas de Clan
    case "ADD_TASK_TO_CLAN":
      if (!store.activeClanId) return store;
      const newTask = {
        id: new Date().getTime(),
        clanId: store.activeClanId,
        title: action.payload.title,
        completed: false,
      };
      return { ...store, clanTasks: [...store.clanTasks, newTask] };

    case "DELETE_CLAN_TASK":
      const updatedTasks = store.clanTasks.filter(
        (task) => task.id !== action.payload.taskId
      );
      return { ...store, clanTasks: updatedTasks };
    case "TOGGLE_CLAN_TASK":
      return {
        ...store,
        clanTasks: store.clanTasks.map((task) => {
          console.log(action.payload.taskId);
          return task.id === action.payload.taskId
            ? { ...task, completed: !task.completed }
            : task;
        }),
      };

    case "UPDATE_PERSONAL_BOTE":
      return { ...store, personalBote: parseFloat(action.payload.newBote) };
    case "ADD_PERSONAL_EXPENSE":
      const newPersonalExpense = {
        id: new Date().getTime(),
        concept: action.payload.concept,
        amount: parseFloat(action.payload.amount),
        date: new Date().toISOString().split("T")[0],
      };
      return {
        ...store,
        personalBote: store.personalBote - newPersonalExpense.amount,
        personalExpenses: [newPersonalExpense, ...store.personalExpenses],
      };
    case "ADD_EXPENSE": // Gasto de Clan
      if (!store.activeClanId) return store;
      const { concept, amount } = action.payload;
      const newExpense = {
        id: new Date().getTime(),
        clanId: store.activeClanId,
        concept: concept,
        amount: parseFloat(amount),
        paidBy: store.profile.name,
        date: new Date().toISOString().split("T")[0], // <-- Añadido
      };
      const newBoteAmount =
        (store.commonBote[store.activeClanId] || 0) - newExpense.amount;
      return {
        ...store,
        expenses: [newExpense, ...store.expenses],
        commonBote: {
          ...store.commonBote,
          [store.activeClanId]: newBoteAmount,
        },
      };
    case "ADD_TO_BOTE": // Añadir a Bote de Clan
      if (!store.activeClanId) return store;
      const newTotal =
        (store.commonBote[store.activeClanId] || 0) +
        parseFloat(action.payload.amount);
      return {
        ...store,
        commonBote: {
          ...store.commonBote,
          [store.activeClanId]: newTotal,
        },
      };

    default:
      throw Error("Unknown action.");
  }
}
