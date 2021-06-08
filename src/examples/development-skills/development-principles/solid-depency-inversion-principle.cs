using System;

public interface INotificationSender
{
	void SendNotification(int userId, string message);
}

public class EmailNotificationSender: INotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the email notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by Email to user with ID: " + userId);
  }
}

public class SMSNotificationSender: INotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the sms notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by SMS to user with ID: " + userId);
  }
}

public class NotificationManager
{
  private INotificationSender _notificationSender;

  public NotificationManager(INotificationSender aNotificationSender) {
    this._notificationSender = aNotificationSender;
  }

  public void SendNotification(int userId, string message)
  {
    this._notificationSender.SendNotification(userId, message);
  }
}

public class Program
{
  public static void Main()
  {
    int userId = 1;
    string message = "Some message";
    string notificationType = "email";

    NotificationManager _notificationManager;
    
    switch (notificationType) {
      case "email":
        _notificationManager = new NotificationManager(new EmailNotificationSender());
        _notificationManager.SendNotification(userId, message);
        break;
      case "sms":
        _notificationManager = new NotificationManager(new SMSNotificationSender());
        _notificationManager.SendNotification(userId, message);
        break;
    }
  }
}