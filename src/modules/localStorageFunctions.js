export function save(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
  }
  
  export function load(key) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem(key));
  }

  /*export function savetask(e) {
    const task = {
        title,
        description,
        completed: false
    }

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  e.preventDefault();*/