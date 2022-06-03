export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface EmployeePayload {
  projectID: string;
  EmployeeData: Employee[];
}

export interface ReducerStateType {
  ProjectData: ProjectDataInterface[];
  Employees: Employee[];
  Clients: ClientDataInterface[];
  ViewableProjects: ProjectDataInterface[];
  ClientNameFilter: string;
  StartDateFilter: number;
  EndDateFilter: number;
}

export interface ProjectDataInterface {
  id: string;
  clientId: string;
  clientName: string[];
  employeeIds: string[];
  employees: Employee[];
  contract: Contract;
}

export interface Contract {
  startDate: string;
  endDate: string;
  size: string;
  startDateTimeStamp: number;
  endDateTimeStamp: number;
}

export interface ClientDataInterface {
  id: string;
  name: string;
}

export interface EmployeeDataAction {
  type: "employeeData";
  fieldName: string;
  payload: Employee[];
}

export interface ProjectDataAction {
  type: "projectData";
  fieldName: string;
  payload: ProjectDataInterface[];
}

export interface ClientDataAction {
  type: "clientData";
  fieldName: string;
  payload: ClientDataInterface[];
}

export interface FilterClientAction {
  type: "FilterClient";
  fieldName: string;
  payload: string;
}

export interface FilterStartDateAction {
  type: "FilterStartDate";
  fieldName: string;
  payload: number;
}

export interface FilterEndDateAction {
  type: "FilterEndDate";
  fieldName: string;
  payload: number;
}

export interface InitialViewableProjectAction {
  type: "viewableProjectInit";
  fieldName: string;
  payload: ProjectDataInterface[];
}

export interface FetchIndividualEmployeeAction {
  type: "individualmployeeData";
  fieldName: string;
  payload: Employee;
}

export interface ViewableProject {
  id: string;
  size: string;
  clientName: string;
  clientId: string;
  employees: Employee[];
  startDate: Date;
  endDate: Date;
}

export interface EmployeePageReducerStateType {
  employee: Employee;
  ProjectData: ProjectDataInterface[];
  MatchedProjects: ProjectDataInterface[];
  Clients: ClientDataInterface[];
}

export interface CreatedMatchedProjectsReducerAction {
  type: "createMatchedProjectsData";
  fieldName: string;
  payload: string;
}

export interface ClientPageReducerStateType {
  client: ClientDataInterface;
  ProjectData: ProjectDataInterface[];
  MatchedProjects: ProjectDataInterface[];
  Employees: Employee[];
  MatchedEmployees: Employee[];
}
export interface IndividualClientFetchAction {
  type: "individualClientData";
  fieldName: string;
  payload: ClientDataInterface;
}

export interface CreatedMatchedEmployeesReducerAction {
  type: "matchEmployeesToClient";
  fieldName: string;
  payload: string;
}
