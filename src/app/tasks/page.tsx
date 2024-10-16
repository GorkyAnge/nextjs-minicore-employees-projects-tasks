'use client'
import { useEffect, useState } from "react";
import { Employee, Project, Task } from "../../../MVC_MODELS/Employee.model";



export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    description: '',
    start_date: '',
    stimated_days: 0,
    state: 1,  // Default to "In Progress"
    employee: '',
    project: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const tasks = await res.json();
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        const employees = await res.json();
        setEmployees(employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const projects = await res.json();
        setProjects(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchTasks();
    fetchEmployees();
    fetchProjects();
  }, []);

  const calculateEndDate = (startDate: string, stimatedDays: number) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + stimatedDays);
    return start.toISOString().split('T')[0];
  };

  const calculateDaysPassed = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const timeDiff = today.getTime() - end.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };


  const handleAddTask = async () => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });
      const addedTask = await res.json();
      setTasks([...tasks, addedTask]);
      setNewTask({
        description: '',
        start_date: '',
        stimated_days: 0,
        state: 1,
        employee: '',
        project: ''
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStateText = (state: number) => {
    return state === 1 ? 'In Progress' : 'Done';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.name} ${employee.surname}` : 'Unknown';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(proj => proj.id === projectId);
    return project ? project.name : 'Unknown';
  };

  const handleFilterTasks = () => {
    const filtered = tasks.filter(task => {
      const taskDate = new Date(task.start_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || taskDate >= start) && (!end || taskDate <= end);
    });
    setFilteredTasks(filtered);
  };
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the tasks in your database including their ID, description, start date, estimated days, state, employee, and project.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setIsModalOpen(true)}
          >
            Add task
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Start Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Estimated Days
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    State
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Employee
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Project
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {task.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.description}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.start_date}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.stimated_days}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getStateText(task.state)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getEmployeeName(task.employee)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getProjectName(task.project)}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        className="text-red-600 hover:text-red-900 ml-4"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete<span className="sr-only">, {task.description}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add New Task</h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="date"
                        placeholder="Start Date"
                        value={newTask.start_date}
                        onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Estimated Days"
                        value={newTask.stimated_days}
                        onChange={(e) => setNewTask({ ...newTask, stimated_days: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <select
                        value={newTask.state}
                        onChange={(e) => setNewTask({ ...newTask, state: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value={1}>In Progress</option>
                        <option value={2}>Done</option>
                      </select>
                      <select
                        value={newTask.employee}
                        onChange={(e) => setNewTask({ ...newTask, employee: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Employee</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>{employee.name} {employee.surname}</option>
                        ))}
                      </select>
                      <select
                        value={newTask.project}
                        onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddTask}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={handleFilterTasks}
          >
            Filter
          </button>
        </div>
      </div>

      <tbody className="divide-y divide-gray-200">
        {filteredTasks.map((task) => {
          const endDate = calculateEndDate(task.start_date, task.stimated_days);
          const daysPassed = calculateDaysPassed(endDate);

          return (
            <tr key={task.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {task.id}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.description}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.start_date}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{endDate}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{daysPassed} días pasados</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.stimated_days}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getStateText(task.state)}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getEmployeeName(task.employee)}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getProjectName(task.project)}</td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <a
                  href="#"
                  className="text-red-600 hover:text-red-900 ml-4"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete<span className="sr-only">, {task.description}</span>
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>

    </main>
  );
}
