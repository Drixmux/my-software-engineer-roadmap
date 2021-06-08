using System;

public interface IProgrammer
{
  void WorkOnTask();
}

public interface ILead
{
  void CreateSubTask();
  void AssignTask();
}

public class Programmer: IProgrammer
{
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
  //Code to create a sub taks from a task.
  }
}
  
public class TeamLead: IProgrammer, ILead
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