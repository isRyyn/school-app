import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeeModel, MarksModel, PageModel, ParentModel, SessionModel, SessionStandardMapping, StandardModel, StudentModel, SubjectModel, TeacherModel, TransactionModel, TransferCertificateModel, TransferCertificateRegisterModel, UserModel, VehicleModel } from './models';
import { ExamType, Role } from './enums';
import { AuthService } from './auth.service';
import { baseHost, baseUrl, testHost, testUrl } from './app-constants';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseHost = testHost;
    private baseUrl = testUrl;

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
        return this.httpClient.get<UserModel>(`${this.baseHost}/auth/${id}`);
    }

    login(payload: UserModel, sessionId: number): Observable<string> {
        return this.httpClient.post<string>(`${this.baseHost}/auth/login/${sessionId}`, payload);
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
     * Shared api
    */
    getCount(): Observable<Map<string, number>> {
        return this.httpClient.get<Map<string, number>>(`${this.baseUrl}/shared/count`);
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

    getStudentPicture(filename?: string): string {
        return `${this.baseUrl}/students/uploads/${filename}`;
    }

    getStudentsByStandard(standardId: number): Observable<StudentModel[]> {
        return this.httpClient.get<StudentModel[]>(`${this.baseUrl}/students/standard/${standardId}`);
    }

    deleteStudent(studentId: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/students/${studentId}`);
    }

    saveStudent(payload: FormData): Observable<StudentModel> {
        const sessionId = this.authService.getSessionId();
        return this.httpClient.post<StudentModel>(`${this.baseUrl}/students/${sessionId}`, payload);
    }

    promoteStudents(studentIds: number[], standardIds: number[], sessionId: number): Observable<void> {
        let params = new HttpParams();
        studentIds.forEach(id => {
            params = params.append('studentIds', id.toString());
        });
        standardIds.forEach(id => {
            params = params.append('standardIds', id.toString());
        });
        params = params.append('sessionId', sessionId);
        return this.httpClient.post<void>(`${this.baseUrl}/students/promote`, params);
    }


    /**
     * Import api
    */
    importStudentData(file: FormData): Observable<void> {
        const sessionId = this.authService.getSessionId();
        return this.httpClient.post<void>(`${this.baseUrl}/import/student/${sessionId}`, file);
    }

    importFeesData(file: FormData): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}/import/fees`, file);
    }

    importMarksData(file: FormData): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}/import/marks`, file);
    }

    /** 
     *  Parents api 
     */
    getAllParents(): Observable<ParentModel[]> {
        return this.httpClient.get<ParentModel[]>(`${this.baseUrl}/parents`);
    }

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
        const sessionId = this.authService.getSessionId();
        return this.httpClient.get<FeeModel[]>(`${this.baseUrl}/fee/${sessionId}`);
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
    getVehicleById(id: number): Observable<VehicleModel> {
        return this.httpClient.get<VehicleModel>(`${this.baseUrl}/vehicles/${id}`);
    }

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

    /**
     * Session Standard Mapping api
    */
    getSpecific(standardId: number): Observable<SessionStandardMapping[]> {
        const sessionId = this.authService.getSessionId();
        return this.httpClient.get<SessionStandardMapping[]>(`${this.baseUrl}/session-standard-mapping/${sessionId}/${standardId}`);
    }

    /**
     * Transfer Certificate api
     */
    getAllTC(): Observable<TransferCertificateModel[]> {
        return this.httpClient.get<TransferCertificateModel[]>(`${this.baseUrl}/tc`);
    }

    getAllTcRegister(): Observable<TransferCertificateRegisterModel[]> {
        return this.httpClient.get<TransferCertificateRegisterModel[]>(`${this.baseUrl}/tc/register`);
    }

    getTCById(id: number): Observable<TransferCertificateModel> {
        return this.httpClient.get<TransferCertificateModel>(`${this.baseUrl}/tc/${id}`);
    }

    addTc(tc: TransferCertificateModel): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}/tc`, tc);
    }

    addTcRegiseter(payload: TransferCertificateRegisterModel): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}/tc/register`, payload);
    }
}

