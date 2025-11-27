import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Eventos = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // 🟣 Fallback mock events
  const fallbackEvents = [
    {
      id: 1,
      title: "Yoga Matutino",
      description: "Sesión de yoga matutina.",
      sport: "Yoga",
      image:
        "https://cdn.getyourguide.com/image/format=auto,fit=contain,gravity=auto,quality=60,width=1440,height=650,dpr=1/tour_img/724c514c8455afc2a374acfef42807e12740f867305e87421a07c24d39d14a23.jpeg",
      participants: [],
      max_participants: 10,
    },
    {
      id: 2,
      title: "Carrera Nocturna",
      description: "Carrera grupal en parque.",
      sport: "Running",
      image:
        "https://www.aytolalaguna.es/actualidad/noticias/.galleries/IMAGENES-Noticias/2025/01/CARRERA-NOCTURNA-2024.jpeg",
      participants: [],
      max_participants: 20,
    },
    {
      id: 3,
      title: "Pilates",
      description: "Relaja y fortalece tu cuerpo.",
      sport: "Pilates",
      image:
        "https://assets.dmagstatic.com/wp-content/uploads/2019/08/tight10of19-677x451.jpg",
      participants: [],
      max_participants: 25,
    },
    {
      id: 4,
      title: "Spinning Intensivo",
      description: "Entrenamiento intenso en bicicleta.",
      sport: "Spinning",
      image: "https://blogscdn.thehut.net/wp-content/uploads/sites/450/2016/08/09041209/beneficios-spinning-1.jpg",
      participants: [],
      max_participants: 10,
    },
    {
      id: 5,
      title: "Meditación Guiada",
      description: "Sesión de meditación guiada para relajarte.",
      sport: "Meditación",
      image: "https://www.elpradopsicologos.es/storage/posts/June2021/group-of-young-sporty-people-sitting-in-padmasana-pose.jpg",
      participants: [],
      max_participants: 20,
    },
    {
      id: 6,
      title: "Entrenamiento Funcional",
      description: "Mejora fuerza y movilidad con ejercicios funcionales.",
      sport: "Funcional",
      image: "https://akroscenter.com/wp-content/uploads/2023/05/Entrenamiento-funcional-Descubre-sus-beneficios.jpg",
      participants: [],
      max_participants: 10,
    },
    {
      id: 7,
      title: "Caminata Saludable",
      description: "Caminata grupal al aire libre para mantenerse activo.",
      sport: "Caminata", image: "https://estaticosgn-cdn.deia.eus/clip/604fa017-9146-4961-b436-f7bb5a2ff949_16-9-discover-aspect-ratio_default_0.jpg",
      participants: [],
      max_participants: 10,
    },
    {
      id: 8,
      title: "Natación para Todos",
      description: "Sesión de natación para todos los niveles.",
      sport: "Natación",
      image: "https://noticiasncc.com/wp-content/uploads/2024/01/183-6-CIENCIA_Natacio%CC%81n-nin%CC%83os_.jpg",
      participants: [],
      max_participants: 35,
    },

  ];

  // 🟦 Trae eventos del backend
  const fetchEvents = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/api/activities`);
      if (!resp.ok) throw new Error("Error fetching");
      const data = await resp.json();
      setEvents(data);
    } catch (err) {
      setEvents([]); // fallback si falla
    }
  };

  useEffect(() => {
    fetchEvents();
    window.addEventListener("activities-updated", fetchEvents);
    return () => window.removeEventListener("activities-updated", fetchEvents);
  }, []);

  // 🟧 Usa backend o fallback
  const list = events.length > 0 ? events : fallbackEvents;

  // 🎯 Deportes únicos (sin duplicados)
  const sportsUnique = Array.from(new Set(list.map((e) => e.sport)));

  // 🔍 Filtro por búsqueda + deporte
  const filteredList = list.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.sport.toLowerCase().includes(search.toLowerCase());

    const matchesSport = sportFilter === "" || event.sport === sportFilter;

    return matchesSearch && matchesSport;
  });

  return (
    <>
      {/* 🔎 FILTROS RESPONSIVE (Bootstrap GRID) */}
      <div className="container mt-5">
        <div className="row g-3 justify-content-center">
          {/* Buscar */}
          <div className="col-12 col-md-6">
            <input
              className="mf-neon-input form-control w-100"
              placeholder="Buscar evento o deporte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Select deporte */}
          <div className="col-12 col-md-6">
            <select
              className="mf-neon-input form-select w-100"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
            >
              <option value="">Todos los deportes</option>
              {sportsUnique.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🟦 LISTADO RESPONSIVE (Bootstrap GRID + MUI Card) */}
      <div className="container mt-5 mb-5">
        <div className="row g-4 justify-content-center">
          {filteredList.map((event) => (
            <div
              key={event.id}
              className="col-12 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-center"
            >
              <Card
                className="w-100"
                style={{
                  boxShadow: "0px 0px 5px 2px #817DF9",
                  borderRadius: "12px",
                  transition: "transform 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {event.image && (
                  <CardMedia
                    component="img"
                    height="175"
                    image={event.image}
                    alt={event.title}
                  />
                )}

                <CardContent className="text-center">
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#20232D", fontWeight: 700 }}
                  >
                    {event.sport}
                  </Typography>

                  <Button
                    size="small"
                    className="mf-neon-btn-small mf-neon-btn-purple"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    🔍
                  </Button>

                  <Typography
                    variant="body2"
                    sx={{ color: "#000000ff", fontSize: "0.75rem" }}
                  >
                    <hr></hr>
                    <h6>{event.title}</h6>
                    {event.description}
                    <br />
                    <strong>
                      Participantes:{" "}
                      {(event.participants?.length ?? 0)}/
                      {event.max_participants}
                    </strong>
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
