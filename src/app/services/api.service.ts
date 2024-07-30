import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeeModel, MarksModel, PageModel, ParentModel, SessionModel, StandardModel, StudentModel, SubjectModel, TeacherModel, TransactionModel, UserModel, VehicleModel } from './models';
import { ExamType, Role } from './enums';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseHost = 'http://localhost:8080';
    private baseUrl = 'http://localhost:8080/api';

    constructor(
        private httpClient: HttpClient,
        private readonly authService: AuthService
    ) { }


    /**
     *  Users api
     */
    getAllUsers(): Observable<UserModel[]> {
        return this.httpClient.get<UserModel[]>(`${this.baseHost}/auth`);
    }

    getUserById(id: number): Observable<UserModel> {
        return this.httpClient.get<UserModel>(`${this.baseHost}/${id}`);
    }

    login(payload: UserModel): Observable<string> {
        return this.httpClient.post<string>(`${this.baseHost}/auth/login`, payload);
    }

    register(payload: UserModel): Observable<string> {
        return this.httpClient.post<string>(`${this.baseHost}/auth/register`, payload);
    }

    updateCredentials(payload: UserModel): Observable<string> {
        return this.httpClient.put<string>(`${this.baseHost}/auth/update-credentials`, payload);
    }

    deleteUser(id: number): Observable<string> {
        return this.httpClient.delete<string>(`${this.baseHost}/auth/${id}`);
    }


    /**
     * Students api
     */
    getAllStudents(): Observable<StudentModel[]> {
        return this.httpClient.get<StudentModel[]>(`${this.baseUrl}/students`);
    }

    getStudentById(id: number): Observable<StudentModel> {
        return this.httpClient.get<StudentModel>(`${this.baseUrl}/students/${id}`);
    }

    getStudentsByStandard(standardId: number): Observable<StudentModel[]> {
        return this.httpClient.get<StudentModel[]>(`${this.baseUrl}/students/standard/${standardId}`);
    }

    saveStudent(payload: FormData): Observable<StudentModel> {
        return this.httpClient.post<StudentModel>(`${this.baseUrl}/students`, payload);
    }

    /** 
     *  Parents api 
     */
    getParentById(id: number): Observable<ParentModel> {
        return this.httpClient.get<ParentModel>(`${this.baseUrl}/parents/${id}`);
    }

    saveParent(payload: ParentModel): Observable<ParentModel> {
        return this.httpClient.post<ParentModel>(`${this.baseUrl}/parents`, payload);
    }

    saveMultipleParents(payload: ParentModel[]): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}/parents/save/multiple`, payload);
    }

    /**
     * Transactions api
     */
    getAllTransactions(): Observable<TransactionModel[]> {
        return this.httpClient.get<TransactionModel[]>(`${this.baseUrl}/transactions`);
    }

    saveTransaction(payload: TransactionModel): Observable<TransactionModel> {
        return this.httpClient.post<TransactionModel>(`${this.baseUrl}/transactions`, payload);
    }

    deleteTransaction(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/transactions/${id}`);
    }

    /**
     * Fees api
     */
    getAllFee(): Observable<FeeModel[]> {
        return this.httpClient.get<FeeModel[]>(`${this.baseUrl}/fee`);
    }

    getAllFeesByStudentId(studentId: number): Observable<FeeModel[]> {
        const sessionId = this.authService.getSessionId();
        return this.httpClient.get<FeeModel[]>(`${this.baseUrl}/fee/${studentId}/${sessionId}`);
    }

    saveFee(payload: FeeModel): Observable<FeeModel> {
        return this.httpClient.post<FeeModel>(`${this.baseUrl}/fee`, payload);
    }

    deleteFee(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/fee/${id}`);
    }

    /**
     * Marks api 
     */
    saveMarks(marks: MarksModel[]): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}/marks/save`, marks);
    }

    getMarksForStandardAndExamName(standardId: number, examName: ExamType): Observable<MarksModel[]> {
        const sessionId = this.authService.getSessionId();
        return this.httpClient.get<MarksModel[]>(`${this.baseUrl}/marks/get/${standardId}/${examName}/${sessionId}`);
    }

    getAllMarksOfStudentForSession(studentId: number): Observable<MarksModel[]> {
        const sessionId = this.authService.getSessionId();
        return this.httpClient.get<MarksModel[]>(`${this.baseUrl}/marks/get/${sessionId}/${studentId}`);
    }


    /**
     * Subjects api
     */
    getAllSubjects(): Observable<SubjectModel[]> {
        return this.httpClient.get<SubjectModel[]>(`${this.baseUrl}/subject`);
    }

    saveSubject(payload: SubjectModel): Observable<SubjectModel> {
        return this.httpClient.post<SubjectModel>(`${this.baseUrl}/subject`, payload);
    }


    /**
     * Standard api
     */
    getAllStandards(): Observable<StandardModel[]> {
        return this.httpClient.get<StandardModel[]>(`${this.baseUrl}/standard`);
    }

    saveStandard(payload: StandardModel): Observable<StandardModel> {
        return this.httpClient.post<StandardModel>(`${this.baseUrl}/standard`, payload);
    }

    /**
     * Teachers api
     */
    getAllTeachers(): Observable<TeacherModel[]> {
        return this.httpClient.get<TeacherModel[]>(`${this.baseUrl}/teachers`);
    }

    saveTeacher(payload: TeacherModel): Observable<TeacherModel> {
        return this.httpClient.post<TeacherModel>(`${this.baseUrl}/teachers`, payload);
    }

    deleteTeacher(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/teachers/${id}`);
    }

    /**
     * Vehicles api
     */
    getAllVehicles(): Observable<VehicleModel[]> {
        return this.httpClient.get<VehicleModel[]>(`${this.baseUrl}/vehicles`);
    }

    saveVehicle(payload: VehicleModel): Observable<VehicleModel> {
        return this.httpClient.post<VehicleModel>(`${this.baseUrl}/vehicles`, payload);
    }

    deleteVehicle(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/vehicles/${id}`);
    }

    /**
     * Sessions api
     */
    getAllSessions(): Observable<SessionModel[]> {
        return this.httpClient.get<SessionModel[]>(`${this.baseUrl}/session`);
    }

    addSession(payload: SessionModel): Observable<SessionModel> {
        return this.httpClient.post<SessionModel>(`${this.baseUrl}/session`, payload);
    }


    /**
     * Pages api
     */
    getAllPages(): Observable<PageModel[]> {
        return this.httpClient.get<PageModel[]>(`${this.baseUrl}/pages`);
    }

    getPageById(id: number): Observable<PageModel> {
        return this.httpClient.get<PageModel>(`${this.baseUrl}/pages/${id}`);
    }

    addPage(payload: PageModel): Observable<PageModel> {
        return this.httpClient.post<PageModel>(`${this.baseUrl}/pages`, payload);
    }

    deletePage(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/pages/${id}`);
    }
}
