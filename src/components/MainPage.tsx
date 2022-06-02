import { useReducer, useEffect } from "react";
import {
  Employee,
  ReducerStateType,
  ProjectDataInterface,
  EmployeeDataAction,
  ProjectDataAction,
  ClientDataAction,
  ClientDataInterface,
  ViewableProject,
  InitialViewableProjectAction,
} from "../utils/interfaces";

const initialState: ReducerStateType = {
  ProjectData: [
    {
      id: "",
      clientId: "",
      clientName: [],
      employeeIds: [""],
      employees: [],
      contract: {
        startDate: "",
        endDate: "",
        size: "",
      },
    },
  ],
  Employees: [
    {
      id: "",
      name: "",
      role: "",
      avatar: "",
    },
  ],
  Clients: [{ id: "", name: "" }],
  ViewableProjects: [],
};

type ReducerActionType =
  | ProjectDataAction
  | EmployeeDataAction
  | ClientDataAction
  | InitialViewableProjectAction;

function reducer(state: any, action: ReducerActionType) {
  switch (action.type) {
    case "projectData": {
      return { ...state, [action.fieldName]: action.payload };
    }
    case "employeeData": {
      for (const { employeeIds, employees } of state.ProjectData) {
        for (const { id, name, role, avatar } of action.payload) {
          if (
            employeeIds.includes(id) &&
            !employees.some((element: Employee) => element.id === id)
          ) {
            employees.push({ id, name, role, avatar });
          }
        }
      }
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }
    case "clientData": {
      for (const { clientId, clientName } of state.ProjectData) {
        for (const { id, name } of action.payload) {
          if (clientId === id && clientName.length === 0) {
            clientName.push(name);
          }
        }
      }
      return { ...state, [action.fieldName]: action.payload };
    }
    case "viewableProjectInit": {
      return { ...state, [action.fieldName]: action.payload };
    }
  }
}

export default function MainPage(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state.ViewableProjects);
  useEffect(() => {
    async function fetchProjectData() {
      const rawProjectFetchedData = await fetch(
        "https://consulting-projects.academy-faculty.repl.co/api/projects"
      );
      const jsonProjectData: ProjectDataInterface[] =
        await rawProjectFetchedData.json();
      for (const project of jsonProjectData) {
        project.employees = [];
        project.clientName = [];
      }
      dispatch({
        type: "projectData",
        fieldName: "ProjectData",
        payload: jsonProjectData,
      });
    }
    async function fetchEmployeeData() {
      const rawEmployeeData = await fetch(
        "https://consulting-projects.academy-faculty.repl.co/api/employees/"
      );
      const jsonEmployeeData: Employee[] = await rawEmployeeData.json();
      dispatch({
        type: "employeeData",
        fieldName: "Employees",
        payload: jsonEmployeeData,
      });
    }
    async function fetchClientData() {
      const rawClientData = await fetch(
        "https://consulting-projects.academy-faculty.repl.co/api/clients/"
      );
      const jsonClientData: ClientDataInterface[] = await rawClientData.json();
      dispatch({
        type: "clientData",
        fieldName: "Clients",
        payload: jsonClientData,
      });
    }
    async function insertAllProjectsAsViewable() {
      const viewableProjectData: ViewableProject[] = [];
      for (let i = 0; i < state.ProjectData.length; i++) {
        const viewableProject: ViewableProject = {
          size: state.ProjectData[i].contract.size,
          clientName: state.ProjectData[i].clientName[0],
          employees: state.ProjectData[i].employees,
          startDate: state.ProjectData[i].contract.startDate,
          endDate: state.ProjectData[i].contract.endDate,
        };
        viewableProjectData.push(viewableProject);
        console.log(i);
      }
      console.log(viewableProjectData);
      dispatch({
        type: "viewableProjectInit",
        fieldName: "ViewableProjects",
        payload: viewableProjectData,
      });
    }
    fetchProjectData()
      .then(() => fetchEmployeeData())
      .then(() => fetchClientData())
      .then(() => insertAllProjectsAsViewable());
  }, []);
  let aggregateRevenue = 0;
  state.ProjectData.map(
    (e: ProjectDataInterface) =>
      (aggregateRevenue =
        aggregateRevenue + parseInt(e.contract.size ? e.contract.size : "5"))
  );
  console.log(state);
  return (
    <div>
      <h2>Agregate Revenue: {aggregateRevenue}</h2>
      <h2>All completed Projects</h2>
      <select>
        {state.Clients.map((client: ClientDataInterface) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      {state.ProjectData.map((e: ProjectDataInterface) => (
        <p key={e.id} className="projectTile">
          Hi {e.id}{" "}
          {e.employees.map((employee) => (
            <p key={employee.id}>{employee.name}</p>
          ))}
        </p>
      ))}
    </div>
  );
}
