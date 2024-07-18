// Declare editingTaskId globally
let editingTaskId = null;

// Fetch tasks from the server
async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        console.log(tasks); // Verify tasks
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Render tasks to the DOM
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the current list

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} - ${task.description}`;

        if (task.completed) {
            li.classList.add('completed');
        }

        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Task';
        editButton.addEventListener('click', () => loadTaskForEdit(task));

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Task';
        deleteButton.addEventListener('click', () => deleteTask(task._id));

        // Create mark as complete button
        const completeButton = document.createElement('button');
        completeButton.textContent = ' Mark as Complete';
        completeButton.addEventListener('click', () => markTaskAsComplete(task._id));

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(completeButton);
        taskList.appendChild(li);
    });
}

// Load task data into the form for editing
function loadTaskForEdit(task) {
    const titleInput = document.getElementById('titleInput');
    const descriptionInput = document.getElementById('descriptionInput');

    titleInput.value = task.title;
    descriptionInput.value = task.description;
    editingTaskId = task._id; // Set editingTaskId to current task ID
}

// Add or update a task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('titleInput');
    const descriptionInput = document.getElementById('descriptionInput');

    const taskData = {
        title: titleInput.value,
        description: descriptionInput.value
    };

    try {
        if (editingTaskId) {
            // Update the existing task
            const response = await fetch(`/api/tasks/${editingTaskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const updatedTask = await response.json();
            console.log('Task updated:', updatedTask);
            editingTaskId = null; // Reset editing state
        } else {
            // Add a new task
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const newTask = await response.json();
            console.log('Task added:', newTask);
        }

        fetchTasks(); // Refresh the list
        titleInput.value = ''; // Clear the input
        descriptionInput.value = ''; // Clear the input
    } catch (error) {
        console.error('Error adding/updating task:', error);
    }
});

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Task deleted');
            fetchTasks(); // Refresh the task list
        } else {
            console.error('Error deleting task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Function to mark a task as complete
async function markTaskAsComplete(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/complete`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: true })
        });

        if (!response.ok) {
            throw new Error('Error marking task as complete');
        }

        const updatedTask = await response.json();
        console.log('Task marked as complete:', updatedTask);

        // Optionally, update UI or fetch tasks again
        fetchTasks();
    } catch (error) {
        console.error('Error marking task as complete:', error);
    }
}


// Fetch tasks when the page loads
fetchTasks();
