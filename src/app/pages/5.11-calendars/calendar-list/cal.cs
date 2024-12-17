using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;

using Google.Apis.Auth.AspNetCore3;
using Google.Apis.Auth.OAuth2.Responses;

namespace ngCommon.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class GoogleCalController : ControllerBase
  {
    static string calendarId = "primary";

    [HttpPost, Route("sync-events")]
    public IActionResult CreateEventsToGoogleCalendar([FromBody] TokenResponse accessToken)
    {
      CalendarService _service = GetCalenderServiceFromAccessToken(accessToken.AccessToken);

      // get the object variables from database and create events
      this.CreateCalenderEvent(_service, appointment); //your application object variable

      //get calendar events which are already created before
      List<Event> listEvents = this.GetCalenderEvents(_service);

      // iterate through calendar events and update specific event
      foreach (var event1 in listEvents)
      {
        this.UpdateCalenderEvent(_service, event1, appointment); //your application object variable
      }
      //your application related deleted event ids which are deleted from your application
      var deletedApntIds = listEvents.Where(p => !appointments.Select(o => o.Id.ToString()).ToArray().Contains(p.ExtendedProperties.Private__.Where(k => k.Key == "appointmentId").FirstOrDefault().Value)).Select(p => p.Id).ToList();
      //iterate through deleted ids and delete it from google calendar
      foreach (var eventId in deletedApntIds)
      {
        this.DeleteCalenderEvent(_service, eventId);
      }

      return Ok(new { result = true });
    }


    private CalendarService GetCalenderServiceFromAccessToken(string accessToken)
    {

      GoogleCredential credential;
      credential = GoogleCredential.FromAccessToken(accessToken);

      // Create Google Calendar API service.
      var service = new CalendarService(new BaseClientService.Initializer
      {
        HttpClientInitializer = credential,
        ApplicationName = "application name"
      });

      return service;
    }

    private void CreateCalenderEvent(CalendarService _service, Models.Appointment appointment) //pass application related object variables
    {
      DateTime newDate = new DateTime();
      Event body = new Event();

      EventDateTime start = new EventDateTime();
      start.DateTime = newDate; //datetime

      EventDateTime end = new EventDateTime();
      end.DateTime = newDate;  //datetime

      body.Start = start;
      body.End = end;
      body.Summary = "summary"; //display name of event
      body.Description = "some description";

      body.ExtendedProperties = new Event.ExtendedPropertiesData()
      {
        Private__ = new Dictionary<string, string>()
                {
                    {"origin","web"},
                    {  "appointmentId",    "some-text" },
                    {   "date", "some-text" },
                    {   "time", "some-text"},
                    { "patientId", "some-text"},
                    //you can use these key value pairs to insert your application related data
                }
      };

      try
      {
        EventsResource.InsertRequest request = new EventsResource.InsertRequest(_service, body, calendarId);
        Event response = request.Execute();
      }
      catch (System.Exception ex)
      {

        throw;
      }

    }

    private List<Event> GetCalenderEvents(CalendarService _service)
    {
      DateTime dt1 = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);

      var newDate = new DateTimeOffset(dt1, this.GetTimeZoneInfo().GetUtcOffset(dt1));

      // Define parameters of request.
      EventsResource.ListRequest request = _service.Events.List(calendarId);
      request.TimeMin = newDate.LocalDateTime;
      request.ShowDeleted = false;
      request.SingleEvents = true;
      // request.MaxResults = 10;
      request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

      // List events.
      Events events = request.Execute();
      return events.Items.Where(p => p.ExtendedProperties != null && p.ExtendedProperties.Private__ != null &&
              p.ExtendedProperties.Private__.Where(p => p.Key == "origin").FirstOrDefault().Value == "web").Select(p => p).ToList();

    }

    private void UpdateCalenderEvent(CalendarService _service, Event event1, Models.Appointment appointment)
    {
      DateTime dt1 = new DateTime(appointment.Date.Year, appointment.Date.Month, appointment.Date.Day,
      appointment.Time.Hours, appointment.Time.Minutes, appointment.Time.Seconds);

      var newDate = new DateTimeOffset(dt1, this.GetTimeZoneInfo().GetUtcOffset(dt1));

      EventDateTime start = new EventDateTime();
      start.DateTime = newDate.LocalDateTime;

      EventDateTime end = new EventDateTime();
      end.DateTime = newDate.LocalDateTime;

      event1.Start = start;
      event1.End = end;

      event1.ExtendedProperties = new Event.ExtendedPropertiesData()
      {
        Private__ = new Dictionary<string, string>()
                {
                    { "origin","web"},
                    { "appointmentId",    appointment.Id.ToString() },
                    { "date", appointment.Date.ToShortDateString() },
                    { "time", appointment.Time.ToString()},
                    { "patientId", appointment.Patient.Id.ToString()}
                }
      };

      EventsResource.UpdateRequest request = new EventsResource.UpdateRequest(_service, event1, calendarId, event1.Id);
      Event response = request.Execute();
    }

    private bool DeleteCalenderEvent(CalendarService _service, string eventId)
    {
      EventsResource.DeleteRequest request = new EventsResource.DeleteRequest(_service, calendarId, eventId);
      string response = request.Execute();
      return true;
    }



  }
}
