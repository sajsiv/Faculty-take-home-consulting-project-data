import { useReducer, useEffect } from "react";
import {
  Employee,
  ReducerStateType,
  ProjectDataInterface,
  EmployeeDataAction,
  ProjectDataAction,
  ClientDataAction,
  ClientDataInterface,
  InitialViewableProjectAction,
  FilterClientAction,
  FilterStartDateAction,
  FilterEndDateAction,
} from "../utils/interfaces";
import { stringDateToTimestamp } from "../utils/stringDateToTimeStamp";

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
        startDateTimeStamp: 0,
        endDateTimeStamp: Infinity,
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
  ClientNameFilter: "",
  StartDateFilter: 0,
  EndDateFilter: Infinity,
};

type ReducerActionType =
  | ProjectDataAction
  | EmployeeDataAction
  | ClientDataAction
  | InitialViewableProjectAction
  | FilterClientAction
  | FilterStartDateAction
  | FilterEndDateAction;

function reducer(state: ReducerStateType, action: ReducerActionType) {
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
      state.ViewableProjects = state.ProjectData;
      return { ...state };
    }
    case "FilterClient": {
      state.ViewableProjects = state.ProjectData;
      console.log();
      return {
        ...state,
        [action.fieldName]: state.ViewableProjects.filter(
          (viewableProject: ProjectDataInterface) =>
            viewableProject.clientId.includes(action.payload)
        )
          .filter(
            (viewableProject: ProjectDataInterface) =>
              viewableProject.contract.endDateTimeStamp <= state.EndDateFilter
          )
          .filter(
            (viewableProject: ProjectDataInterface) =>
              viewableProject.contract.startDateTimeStamp >=
              state.StartDateFilter
          ),
        ClientNameFilter: action.payload,
      };
    }
    case "FilterStartDate": {
      if (action.payload <= state.EndDateFilter) {
        state.ViewableProjects = state.ProjectData;
        return {
          ...state,
          [action.fieldName]: action.payload,
          ViewableProjects: state.ViewableProjects.filter(
            (viewableProject: ProjectDataInterface) =>
              viewableProject.contract.startDateTimeStamp >= action.payload
          )
            .filter(
              (viewableProject: ProjectDataInterface) =>
                viewableProject.contract.endDateTimeStamp <= state.EndDateFilter
            )
            .filter((viewableProject: ProjectDataInterface) =>
              viewableProject.clientId.includes(state.ClientNameFilter)
            ),
        };
      } else {
        alert("Choose an start date before the end date");
        return { ...state };
      }
    }
    case "FilterEndDate": {
      console.log("End Date Filter Payload:" + action.payload);
      if (action.payload >= state.StartDateFilter) {
        state.ViewableProjects = state.ProjectData;
        return {
          ...state,
          [action.fieldName]: action.payload,
          ViewableProjects: state.ViewableProjects.filter(
            (viewableProject: ProjectDataInterface) =>
              viewableProject.contract.startDateTimeStamp >=
              state.StartDateFilter
          )
            .filter(
              (viewableProject: ProjectDataInterface) =>
                viewableProject.contract.endDateTimeStamp <= action.payload
            )
            .filter((viewableProject: ProjectDataInterface) =>
              viewableProject.clientId.includes(state.ClientNameFilter)
            ),
        };
      } else {
        alert("Choose an end date after the start date");
        return { ...state };
      }
    }
  }
}

export default function MainPage(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    async function fetchProjectData() {
      const rawProjectFetchedData = await fetch(
        "https://consulting-projects.academy-faculty.repl.co/api/projects"
      );
      const jsonProjectData: ProjectDataInterface[] =
        await rawProjectFetchedData.json();
      console.log(jsonProjectData);
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
      console.log(1);
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
      console.log(2);
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
      console.log(3);
    }
    async function insertAllProjectsAsViewable() {
      const viewableProjectData: ProjectDataInterface[] = [];
      for (let i = 0; i < state.ProjectData.length; i++) {
        const viewableProject: ProjectDataInterface = state.ProjectData[i];
        viewableProjectData.push(viewableProject);
      }
      console.log(viewableProjectData);
      dispatch({
        type: "viewableProjectInit",
        fieldName: "ViewableProjects",
        payload: viewableProjectData,
      });
      console.log(state.ProjectData.length);
    }
    fetchProjectData()
      .then(() => fetchEmployeeData())
      .then(() => fetchClientData())
      .then(() => insertAllProjectsAsViewable()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function setAggregateRev() {
    let aggregateRevenue = 0;
    state.ViewableProjects.map(
      (e: ProjectDataInterface) =>
        (aggregateRevenue =
          aggregateRevenue + parseInt(e.contract.size ? e.contract.size : "5"))
    );
    return aggregateRevenue;
  }
  function handleStartDateFilter(inputStartDateFilter: string) {
    if (inputStartDateFilter === "") {
      dispatch({
        type: "FilterStartDate",
        fieldName: "StartDateFilter",
        payload: 0,
      });
    } else {
      const tempDateType = new Date(inputStartDateFilter);
      const startFiltertTimeStamp = tempDateType.getTime();
      console.log(inputStartDateFilter);
      dispatch({
        type: "FilterStartDate",
        fieldName: "StartDateFilter",
        payload: startFiltertTimeStamp,
      });
    }
  }
  function handleEndDateFilter(inputEndDateFilter: string) {
    console.log(inputEndDateFilter);
    if (inputEndDateFilter === "") {
      dispatch({
        type: "FilterEndDate",
        fieldName: "EndDateFilter",
        payload: Infinity,
      });
    } else {
      const tempDateType = new Date(inputEndDateFilter);
      const endFiltertTimeStamp = tempDateType.getTime();
      dispatch({
        type: "FilterEndDate",
        fieldName: "EndDateFilter",
        payload: endFiltertTimeStamp,
      });
    }
  }

  function handleClientSelect(client: string) {
    dispatch({
      type: "FilterClient",
      fieldName: "ViewableProjects",
      payload: client,
    });
  }
  console.log(state);
  console.log(
    state.StartDateFilter,
    state.EndDateFilter,
    state.ViewableProjects
  );
  return (
    <div>
      <h1>CorpSquad's completed Projects</h1>
      <h2>Aggregate Revenue: {setAggregateRev()}</h2>
      Filter by client
      <select onChange={(e) => handleClientSelect(e.target.value)}>
        <option value={""}>All clients</option>
        {state.Clients.map((client: ClientDataInterface) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      Start Date
      <input
        type="date"
        onChange={(e) => handleStartDateFilter(e.target.value)}
      ></input>
      End Date
      <input
        type="date"
        onChange={(e) => handleEndDateFilter(e.target.value)}
      ></input>
      <div className="projectsFlex">
        {state.ViewableProjects.map((e: ProjectDataInterface) => (
          <div className="ProjectTile" key={e.id}>
            <h2>
              <a
                href={
                  "https://saj-sivia-faculty-takehome.netlify.app/clients/" +
                  e.clientId
                }
              >
                {e.clientName}
              </a>
              , From {e.contract.startDate} to {e.contract.endDate}
            </h2>
            <h4>Employees</h4>
            {e.employees.map((e) => (
              <div key={e.id}>
                <p>
                  <a
                    href={
                      "https://saj-sivia-faculty-takehome.netlify.app/employees/" +
                      e.id
                    }
                  >
                    {e.name}
                  </a>
                  , {e.role}
                </p>
                <img src={e.avatar} alt={e.name + "profile picture"}></img>
              </div>
            ))}
            {e.employees.length === 0 ? (
              <p>No employees found for this project</p>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
