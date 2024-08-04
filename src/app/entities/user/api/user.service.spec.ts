import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { CheckUserResponseData } from '../model/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check username availability', () => {
    const mockResponse: CheckUserResponseData = { isAvailable: true };
    const testUsername = 'testuser';

    service.checkUsername$(testUsername).subscribe(
      response => expect(response).toEqual(mockResponse),
      fail
    );

    const req = httpTestingController.expectOne('/api/checkUsername');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ username: testUsername });

    req.flush(mockResponse);
  });

  it('should return an error when the server returns a 404', () => {
    const testUsername = 'testuser';

    service.checkUsername$(testUsername).subscribe(
      _ => fail('expected an error, not response'),
      error => expect(error.status).toBe(404)
    );

    const req = httpTestingController.expectOne('/api/checkUsername');

    // Respond with a 404 and the status text in the response
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });
});
