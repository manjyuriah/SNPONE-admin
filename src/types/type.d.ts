export interface Applicant {
  _id?: string;
  DateOfApplication: string | number;
  name: string;
  gender: string;
  DateOfBirth: string | number;
  phone: string | number;
  email: string;
  transportation: string;
  address: string;
  isChecked: boolean;
}
// TODO: 타입 좁히기
// type gender = "femail" | "male";
