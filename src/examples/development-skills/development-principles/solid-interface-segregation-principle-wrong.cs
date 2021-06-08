using System;

public interface ILead
{
  void CreateSubTask();
  void AssignTask();
  void WorkOnTask();
}

public class Programmer: ILead
{
  public void AssignTask()
  {
    throw new Exception("Programmer can't assign a Task");
  }

  public void CreateSubTask()
  {
    throw new Exception("Programmer can't create a sub Task");
  }

  public void WorkOnTask()
  {
    //code to implement to work on the Task.
  }
}

public class Manager: ILead
{
  public void AssignTask()
  {
    //Code to assign a Task
  }

  public void CreateSubTask()
  {
    //Code to create a sub task from a task.
  }

  public void WorkOnTask()
  {
    throw new Exception("Manager can't work on Task");
  }
}
  
public class TeamLead: ILead
{
  public void AssignTask()
  {
    //Code to assign a Task
  }

  public void CreateSubTask()
  {
    //Code to create a sub task from a task.
  }

  public void WorkOnTask()
  {
    //code to implement to work on the Task.
  }
}

public class Program
{
  public static void Main()
  {
    Programmer p = new Programmer();
    Manager m = new Manager();
    TeamLead tl = new TeamLead();
  }
}