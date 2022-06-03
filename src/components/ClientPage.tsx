import { useParams } from "react-router-dom";
import { useEffect, useReducer } from "react";
import {
  Employee,
  ClientPageReducerStateType,
  ProjectDataInterface,
  ProjectDataAction,
  ClientDataInterface,
  IndividualClientFetchAction,
  EmployeeDataAction,
  CreatedMatchedEmployeesReducerAction,
  CreatedMatchedProjectsReducerAction,
} from "../utils/interfaces";
import { stringDateToTimestamp } from "../utils/stringDateToTimeStamp";

type ReducerActionType =
  | IndividualClientFetchAction
  | ProjectDataAction
  | EmployeeDataAction
  | CreatedMatchedEmployeesReducerAction
  | CreatedMatchedProjectsReducerAction;

const initialState: ClientPageReducerStateType = {
  client: { id: "", name: "" },
  ProjectData: [],
  MatchedProjects: [],
  Employees: [],
  MatchedEmployees: [],
};

function reducer(state: ClientPageReducerStateType, action: ReducerActionType) {
  switch (action.type) {
    case "individualClientData": {
      return { ...state, [action.fieldName]: action.payload };
    }
    case "projectData": {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
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
      return { ...state, [action.fieldName]: action.payload };
    }
    case "createMatchedProjectsData": {
      return {
        ...state,
        [action.fieldName]: state.ProjectData.filter(
          (project: ProjectDataInterface) =>
            project.clientId.includes(action.payload)
        ),
      };
    }
    case "matchEmployeesToClient": {
      const matchedEmployees: Employee[] = [];
      for (const project of state.MatchedProjects) {
        for (const employee of project.employees) {
          if (!matchedEmployees.includes(employee)) {
            matchedEmployees.push(employee);
          }
        }
      }
      return { ...state, [action.fieldName]: matchedEmployees };
    }
  }
}

export function ClientPage(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { clientId } = useParams();
  useEffect(() => {
    async function fetchClient() {
      const rawClientData = await fetch(
        "https://consulting-projects.academy-faculty.repl.co/api/clients/" +
          clientId
      );
      const jsonClientData: ClientDataInterface = await rawClientData.json();
      dispatch({
        type: "individualClientData",
        fieldName: "client",
        payload: jsonClientData,
      });
    }
    async function fetchProjectData() {
      const rawProjectFetchedData = await fetch(
        "https://consulting-projects.academy-faculty.repl.co/api/projects"
      );
      const jsonProjectData: ProjectDataInterface[] =
        await rawProjectFetchedData.json();
      for (const project of jsonProjectData) {
        project.employees = [];
        project.clientName = [];
        project.contract.startDateTimeStamp = stringDateToTimestamp(
          project.contract.startDate
        );
        project.contract.endDateTimeStamp = stringDateToTimestamp(
          project.contract.endDate
        );
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
    async function matchProjectsToClient() {
      dispatch({
        type: "createMatchedProjectsData",
        fieldName: "MatchedProjects",
        payload: clientId ? clientId : "CLIENT_ID_REST_PARAM_EMPTY",
      });
    }
    async function matchEmployeesToClient() {
      dispatch({
        type: "matchEmployeesToClient",
        fieldName: "MatchedEmployees",
        payload: clientId ? clientId : "CLIENT_ID_REST_PARAM_EMPTY",
      });
    }
    fetchClient()
      .then(() => fetchProjectData())
      .then(() => fetchEmployeeData())
      .then(() => matchProjectsToClient())
      .then(() => matchEmployeesToClient()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(state);
  return (
    <div>
      <h1>{state.client.name}</h1>
      <h2>
        {state.MatchedProjects.length} Project
        {state.MatchedProjects.length > 1 && "s"} completed for{" "}
        {state.client.name}
      </h2>
      <div>
        {state.MatchedProjects.length > 0 &&
          state.MatchedProjects.map((project) => (
            <p key={project.id}>
              <h4>Dates:</h4> <br></br> {project.contract.startDate} to{" "}
              {project.contract.endDate} <br></br> <h4>Cost:</h4> <br></br> £
              {project.contract.size} <br></br>
              <h4>Employees:</h4>{" "}
              {project.employees.map((employee) => (
                <p key={employee.id}>
                  <a
                    href={
                      "https://saj-sivia-faculty-takehome.netlify.app/employees/" +
                      employee.id
                    }
                  >
                    {employee.name}
                  </a>
                  , {employee.role}
                </p>
              ))}
              <br></br>
              <br></br>
            </p>
          ))}
      </div>
      <h2>Employees who have worked with {state.client.name}</h2>
      <div>
        {state.MatchedEmployees.length > 0 &&
          state.MatchedEmployees.map((employee) => (
            <p key={employee.id}>
              <img
                src={employee.avatar}
                alt={employee.name + " profile pic"}
              ></img>{" "}
              <h4>
                Name:{" "}
                <a
                  href={
                    "https://saj-sivia-faculty-takehome.netlify.app/employees/" +
                    employee.id
                  }
                >
                  {employee.name}
                </a>
              </h4>{" "}
              <br></br> <h4>Role: {employee.role}</h4> <br></br>
              <br></br>
            </p>
          ))}
      </div>
    </div>
  );
}
