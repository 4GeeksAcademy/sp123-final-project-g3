export const initialStore = () => {
  return {
    message: null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    jobs: [],
    myKanban: [],
    statistics: { pending: 0, interview: 0, rejected: 0, offer: 0, total: 0 },

    // Tasks array for initial demo (can be removed if not needed)
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
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        tasks: store.tasks.map((task) =>
          task.id === id ? { ...task, background: color } : task,
        ),
      };

    case "login":
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "logout":
      return {
        ...store,
        user: null,
        token: null,
        myKanban: [],
        statistics: {
          pending: 0,
          interview: 0,
          rejected: 0,
          offer: 0,
          total: 0,
        },
      };

    case "set_jobs":
      return {
        ...store,
        jobs: action.payload,
      };

    case "set_kanban":
      return {
        ...store,
        myKanban: action.payload,
      };

    case "set_statistics":
      return {
        ...store,
        statistics: action.payload,
      };

    case "set_private_data":
      return {
        ...store,
        message: action.payload,
      };

    case 'update_user':
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...store,
        user: action.payload
      };

    case 'set_user_cvs':
      return {
        ...store,
        userCVs: action.payload
      };

    default:
      return store;
  }
}

export const actionCreators = (dispatch, getStore) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return {
    login: async (email, password) => {
      const resp = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        console.error("Login Error: " + resp.statusText);
        return false;
      }

      const data = await resp.json();

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.results));

      dispatch({
        type: "login",
        payload: {
          user: data.results,
          token: data.access_token,
        },
      });
      return true;
    },

    signup: async (email, password, name, profesional_title) => {
      const resp = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, profesional_title }),
      });

      if (!resp.ok) {
        console.error("Signup Error");
        return false;
      }
      return true;
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "logout" });
      return true;
    },

    updateUser: (userData) => {
      dispatch({ type: "update_user", payload: userData });
    },

    getPrivateData: async () => {
      const store = getStore();
      const token = store.token || localStorage.getItem("token");

      if (!token) return false;

      const resp = await fetch(`${backendUrl}/api/protected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!resp.ok) {
        console.error("Error fetching private data");
        return false;
      }

      const data = await resp.json();
      dispatch({ type: "set_private_data", payload: data.message });
      return true;
    },

    // Legacy method - kept for reference, but getMyPostulations is the new standard
    getKanban: async () => {
      const store = getStore();
      const token = store.token || localStorage.getItem("token");
      if (!token) return [];

      const resp = await fetch(`${backendUrl}/api/postulations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!resp.ok) return [];
      const data = await resp.json();

      const kanbanCards = data.results.map((post) => ({
        id: post.id,
        status: post.status,
        role: post.job ? post.job.title : "Unknown Role",
        company: post.job ? post.job.company : "Unknown Company",
        priority: "Medium",
        notes: post.job ? post.job.notes : "",
        link: post.job ? post.job.link : "",
        job_id: post.job ? post.job.id : null,
        interviewDate: post.interview_date,
      }));

      dispatch({ type: "set_kanban", payload: kanbanCards });
      return kanbanCards;
    },

    loginWithGoogle: async (token) => {
      const resp = await fetch(`${backendUrl}/api/google_auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!resp.ok) {
        console.error("Google Auth Error: " + resp.statusText);
        return false;
      }

      const data = await resp.json();

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.results));

      dispatch({
        type: "login",
        payload: {
          user: data.results,
          token: data.access_token,
        },
      });
      return true;
    },

    // --- SEARCH JOBS (AGGREGATOR: Remotive + Jobicy) ---
    getJobs: async (search = "") => {
      let urlRemotive =
        "https://remotive.com/api/remote-jobs?category=software-dev&limit=10";
      if (search) {
        urlRemotive = `https://remotive.com/api/remote-jobs?search=${search}&limit=10`;
      }

      let urlJobicy =
        "https://jobicy.com/api/v2/remote-jobs?count=10&geo=worldwide&industry=engineering";
      if (search) {
        urlJobicy = `https://jobicy.com/api/v2/remote-jobs?count=10&tag=${search}`;
      }

      try {
        const [resRemotive, resJobicy] = await Promise.allSettled([
          fetch(urlRemotive),
          fetch(urlJobicy),
        ]);

        let combinedJobs = [];

        // --- PROCESAR REMOTIVE ---
        if (resRemotive.status === "fulfilled" && resRemotive.value.ok) {
          const dataRemotive = await resRemotive.value.json();
          if (dataRemotive.jobs) {
            const jobsRemotive = dataRemotive.jobs.slice(0, 10).map((job) => ({
              id: `remotive-${job.id}`,
              title: job.title,
              company: job.company_name,
              salary: job.salary || "Not specified",
              location: job.candidate_required_location,
              description: job.description,
              apply_url: job.url,
              date: job.publication_date,
              origin_api: "Remotive",
            }));
            combinedJobs = [...combinedJobs, ...jobsRemotive];
          }
        }

        // --- PROCESAR JOBICY ---
        if (resJobicy.status === "fulfilled" && resJobicy.value.ok) {
          const dataJobicy = await resJobicy.value.json();
          if (dataJobicy.jobs) {
            const jobsJobicy = dataJobicy.jobs.map((job) => ({
              id: `jobicy-${job.id}`,
              title: job.jobTitle,
              company: job.companyName,
              salary:
                job.annualSalaryMin && job.annualSalaryMax
                  ? `${job.annualSalaryMin}-${job.annualSalaryMax} ${job.salaryCurrency}`
                  : "Not specified",
              location: job.jobGeo,
              description: job.jobDescription,
              apply_url: job.url,
              date: job.pubDate,
              origin_api: "Jobicy",
            }));
            combinedJobs = [...combinedJobs, ...jobsJobicy];
          }
        }

        dispatch({
          type: "set_jobs",
          payload: combinedJobs,
        });
        return true;
      } catch (error) {
        console.error("Error in getJobs aggregator:", error);
        return false;
      }
    },

    // --- CREATE POSTULATION (Guardar en DB) ---
    createPostulation: async (jobData) => {
      const store = getStore();
      const token = store.token || localStorage.getItem("token");
      if (!token) return false;

      const payload = {
        job: {
          title: jobData.title,
          company: jobData.company,
          link: jobData.apply_url || jobData.link,
          description: jobData.description,
          location: jobData.location,
          salary: jobData.salary,
        },
        status: "to_apply", // Default status consistent with Home.jsx columns
      };

      const resp = await fetch(`${backendUrl}/api/postulations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        console.error("Error saving postulation");
        return false;
      }
      return true;
    },

    // --- UPDATE POSTULATION STATUS (Kanban Persistence) ---
    updatePostulation: async (postulationId, newStatus) => {
      const store = getStore();
      const token = store.token || localStorage.getItem("token");
      if (!token) return false;

      console.log(
        `Updating postulation ${postulationId} to status: ${newStatus}`,
      );

      try {
        const resp = await fetch(
          `${backendUrl}/api/postulations/${postulationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ status: newStatus }),
          },
        );

        if (!resp.ok) {
          console.error(
            "Error updating postulation status:",
            resp.status,
            resp.statusText,
          );
          return false;
        }

        // Log success
        // const data = await resp.json();
        // console.log("Update success:", data);

        // Optimistic update in store (Confirmed by successful fetch)
        const updatedKanban = store.myKanban.map((card) =>
          card.id === postulationId ? { ...card, status: newStatus } : card,
        );
        dispatch({ type: "set_kanban", payload: updatedKanban });

        return true;
      } catch (error) {
        console.error("Fetch error in updatePostulation:", error);
        return false;
      }
    },

    // --- GET MY POSTULATIONS & STATS ---
    getMyPostulations: async () => {
      const store = getStore();
      const token = store.token || localStorage.getItem("token");
      if (!token) return [];

      try {
        const resp = await fetch(`${backendUrl}/api/postulations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "Cache-Control": "no-store", // Prevent caching
          },
        });

        if (!resp.ok) {
          console.error("Error fetching user postulations");
          return [];
        }

        const data = await resp.json();

        const stats = {
          pending: 0,
          interview: 0,
          rejected: 0,
          offer: 0,
          total: data.results.length,
        };

        // Map to flattened structure for Home.jsx
        const kanbanCards = data.results.map((post) => {
          // Normalize status
          let status = (post.status || "").toLowerCase().trim();

          // Check matching
          if (
            status === "pendiente" ||
            status === "to apply" ||
            status === "to_apply"
          ) {
            stats.pending++;
          } else if (status.includes("appli") || status === "applied") {
            stats.pending++;
          } else if (
            status.includes("entrevista") ||
            status.includes("interview")
          )
            stats.interview++;
          else if (status.includes("oferta") || status.includes("offer"))
            stats.offer++;
          else if (status.includes("rechazado") || status.includes("rejected"))
            stats.rejected++;

          return {
            id: post.id,
            status: status === "pendiente" ? "to_apply" : status, // Normalize "Pending" to "to_apply" for column key
            role: post.job ? post.job.title : "Unknown Role",
            company: post.job ? post.job.company : "Unknown Company",
            priority: "Medium",
            notes: post.job ? post.job.notes : "",
            link: post.job ? post.job.link : "",
            job_id: post.job ? post.job.id : null,
            interviewDate: post.interview_date,
          };
        });

        dispatch({ type: "set_kanban", payload: kanbanCards });
        dispatch({ type: "set_statistics", payload: stats });
        return kanbanCards;
      } catch (error) {
        console.error("Error fetching postulations:", error);
        return [];
      }
    },

    // Wrapper for legacy Search.jsx compatibility
    saveJob: async (jobData) => {
      const store = getStore();
      const token = store.token || localStorage.getItem("token");
      if (!token) return false;

      const payload = {
        job: {
          title: jobData.title || jobData.job_title,
          company: jobData.company || jobData.company_name,
          link: jobData.apply_url || jobData.link || jobData.job_apply_link,
          description: jobData.description || jobData.job_description,
          location: jobData.location || jobData.job_city,
          salary: jobData.salary,
        },
        status: "to_apply",
      };

      const resp = await fetch(`${backendUrl}/api/postulations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) return false;
      return true;
    },
  };
};
