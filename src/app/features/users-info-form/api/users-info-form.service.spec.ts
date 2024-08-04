import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersInfoFormService } from './users-info-form.service';
import { SubmitFormResponseData, UserInfoFormValue } from '../models/users-info-form.model';

describe('UsersInfoFormService', () => {
  let service: UsersInfoFormService;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersInfoFormService]
    });


    service = TestBed.inject(UsersInfoFormService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit form data', () => {
    const mockFormData: UserInfoFormValue[] = [
      { country: 'USA', username: 'testuser1', birthday: '1990-01-01' },
      { country: 'Canada', username: 'testuser2', birthday: '1991-01-01' }
    ];
    const mockResponse: SubmitFormResponseData = { result: 'success' };

    service.submitForm$(mockFormData).subscribe(
      response => expect(response).toEqual(mockResponse),
      fail
    );

    const req = httpTestingController.expectOne('/api/submitForm');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockFormData);

    req.flush(mockResponse);
  });

  it('should return an error when the server returns a 404', () => {
    const mockFormData: UserInfoFormValue[] = [
      { country: 'USA', username: 'testuser1', birthday: '1990-01-01' }
    ];

    service.submitForm$(mockFormData).subscribe(
      _ => fail('expected an error, not response'),
      error => expect(error.status).toBe(404)
    );

    const req = httpTestingController.expectOne('/api/submitForm');
    expect(req.request.method).toEqual('POST');

    req.flush(null, { status: 404, statusText: 'Not Found' });
  });
});
