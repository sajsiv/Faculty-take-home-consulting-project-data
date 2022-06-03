import { useParams } from "react-router-dom";
import { useEffect, useReducer } from "react";
import {
  Employee,
  EmployeePageReducerStateType,
  FetchIndividualEmployeeAction,
  ProjectDataInterface,
  ProjectDataAction,
  ClientDataInterface,
  ClientDataAction,
  CreatedMatchedProjectsReducerAction,
} from "../utils/interfaces";
import { stringDateToTimestamp } from "../utils/stringDateToTimeStamp";

type ReducerActionType =
  | FetchIndividualEmployeeAction
  | ProjectDataAction
  | ClientDataAction
  | CreatedMatchedProjectsReducerAction;

const initialState: EmployeePageReducerStateType = {
  employee: { id: "", name: "", role: "", avatar: "" },
  ProjectData: [],
  MatchedProjects: [],
  Clients: [],
};

function reducer(
  state: EmployeePageReducerStateType,
  action: ReducerActionType
) {
  switch (action.type) {
    case "individualmployeeData": {
      return { ...state, [action.fieldName]: action.payload };
    }
    case "projectData": {
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
    case "createMatchedProjectsData": {
      return {
        ...state,
        [action.fieldName]: state.ProjectData.filter((project) =>
          project.employeeIds.includes(action.payload)
        ),
      };
    }
  }
}

export default function EmployeePage(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { employeeId } = useParams();
  useEffect(() => {
    async function fetchEmployee() {
      const rawEmployeeData = await fetch(
        "https://consulting-projects.academy-faculty.repl.co/api/employees/" +
          employeeId
      );
      const jsonEmployeeData: Employee = await rawEmployeeData.json();
      dispatch({
        type: "individualmployeeData",
        fieldName: "employee",
        payload: jsonEmployeeData,
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
    async function createMatchedProjectsData() {
      dispatch({
        type: "createMatchedProjectsData",
        fieldName: "MatchedProjects",
        payload: employeeId ? employeeId : "EMPTY_REST_PARAMETER",
      });
    }
    fetchEmployee()
      .then(() => fetchProjectData())
      .then(() => fetchClientData())
      .then(() => createMatchedProjectsData()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(state);
  return (
    <div>
      <h1>
        {state.employee.name}, {state.employee.role}
      </h1>
      <img
        src={state.employee.avatar}
        alt={state.employee.name + " profile pic"}
      ></img>
      <h2>Projects</h2>
      {state.MatchedProjects.length > 0 && (
        <div>
          {state.MatchedProjects.map((project: ProjectDataInterface) => (
            <p key={project.id}>
              Worked on a project for{" "}
              <a
                href={
                  "https://saj-siv-faculty-takehome.netlify.app/clients/" +
                  project.clientId
                }
              >
                {project.clientName}
              </a>
              , From {project.contract.startDate} to {project.contract.endDate}
            </p>
          ))}
        </div>
      )}
      {state.MatchedProjects.length === 0 && (
        <p>
          No completed projects found for employeeId: {employeeId}{" "}
          {state.employee && " Employee Name: " + state.employee.name}
        </p>
      )}
    </div>
  );
}
