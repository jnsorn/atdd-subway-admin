const BASE_URL = "http://localhost:8080";

const METHOD = {
  PUT() {
    return {
      method: "PUT"
    };
  },
  DELETE() {
    return {
      method: "DELETE"
    };
  },
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: data
      })
    };
  }
};

const api = (() => {
  const request = (uri, config) => fetch(uri, config).then(data => data.json());
  const line = {
    get() {
      return request(`${BASE_URL}/lines`);
    },
    create(data) {
      request(`${BASE_URL}/line`, METHOD.POST(data));
    },
    update(data) {
      request(`${BASE_URL}/line/${id}`, METHOD.PUT(data));
    },
    delete(id) {
      request(`${BASE_URL}/line/${id}`, METHOD.DELETE);
    }
  }

  const station = {
    get() {
      request(`${BASE_URL}/stations`);
    },
    create(data) {
      request(`${BASE_URL}/station`, METHOD.POST(data));
    },
    update(data) {
      request(`${BASE_URL}/station/${id}`, METHOD.PUT(data));
    },
    delete(id) {
      request(`${BASE_URL}/station/${id}`, METHOD.DELETE);
    }
  };

  return {
    station,
    line
  };
})();

export default api;
