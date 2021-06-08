using System;

public class EmailNotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the email notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by Email to user with ID: " + userId);
  }
}

public class SMSNotificationSender
{
  public void SendNotification(int userId, string message)
  {
    // Here we add the code to send the sms notification to the user.
    Console.WriteLine("Notification with message: '" + message + "' sent by SMS to user with ID: " + userId);
  }
}

public class NotificationManager
{
  public void SendNotificationByEmail(int userId, string message)
  {
    EmailNotificationSender emailNotificationSender = new EmailNotificationSender();
    emailNotificationSender.SendNotification(userId, message);
  }

  public void SendNotificationBySMS(int userId, string message)
  {
    SMSNotificationSender smsNotificationSender = new SMSNotificationSender();
    smsNotificationSender.SendNotification(userId, message);
  }
} 

public class Program
{
  public static void Main()
  {
    int userId = 1;
    string message = "Some message";
    string notificationType = "sms";
    
    switch (notificationType) {
      case "email":
        new NotificationManager().SendNotificationByEmail(userId, message);
        break;
      case "sms":
        new NotificationManager().SendNotificationBySMS(userId, message);
        break;
    }
  }
}