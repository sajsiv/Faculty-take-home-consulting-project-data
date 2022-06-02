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
  ViewableProjects: ViewableProject[];
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

export interface InitialViewableProjectAction {
  type: "viewableProjectInit";
  fieldName: string;
  payload: ViewableProject[];
}

export interface ViewableProject {
  size: string;
  clientName: string;
  employees: Employee[];
  startDate: string;
  endDate: string;
}
