import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CountryService } from './country.service';

describe('CountryService', () => {
  let service: CountryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService]
    });

    service = TestBed.inject(CountryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected countries (called once)', () => {
    const expectedCountries = ['USA', 'Canada', 'Mexico'];

    service.getCountries$().subscribe(
      countries => expect(countries).toEqual(expectedCountries),
      fail
    );

    const req = httpTestingController.expectOne('/api/countries');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedCountries);
  });

  it('should be OK returning no countries', () => {
    service.getCountries$().subscribe(
      countries => expect(countries.length).toEqual(0),
      fail
    );

    const req = httpTestingController.expectOne('/api/countries');
    req.flush([]);
  });

  it('should return an error when the server returns a 404', () => {
    service.getCountries$().subscribe(
      _ => fail('expected an error, not countries'),
      error => expect(error.statusText).toBe('Not Found')
    );

    const req = httpTestingController.expectOne('/api/countries');

    req.flush(null, { status: 404, statusText: 'Not Found' });
  });
});
