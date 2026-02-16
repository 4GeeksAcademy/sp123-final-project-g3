export const initialStore = () => {
  return {
    message: null,
    user: null,
    token: localStorage.getItem("token") || null,
    jobs: [],
    myKanban: [],
    tasks: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  };
};

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        tasks: store.tasks.map((task) => (task.id === id ? { ...task, background: color } : task))
      };

    case 'login':
      localStorage.setItem("token", action.payload.token);
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token
      };

    case 'logout':
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...store,
        user: null,
        token: null,
        myKanban: []
      };

    case 'set_jobs':
      return {
        ...store,
        jobs: action.payload
      };

    case 'set_kanban':
      return {
        ...store,
        myKanban: action.payload
      };

    default:
      return store;
  }
}
