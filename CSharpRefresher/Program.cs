using System.Runtime.CompilerServices;

int yes = 1;

if (yes == 1)
{
    Console.WriteLine("Yes is equal to 1");
}
else
{
    Console.WriteLine("Yes is not equal to 1");
}

int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

for (int i = 0; i < numbers.Length; i++)
{
    Console.WriteLine(numbers[i]);
}
// This is an array of integers from 1 to 10. It prints each number in the array to the console.

//test for a API endpoint
route.MapGet("/api/hello", () => "Hello, World!");
// This is a simple API endpoint that responds with "Hello, World!" when accessed via a GET request.

for (int i = 0; i < 10; i++)
{
    if (i % 2 == 0)
    {
        Console.WriteLine($"{i} is even");
    }
    else
    {
        Console.WriteLine($"{i} is odd");
    }
}


await Console.Out.WriteLineAsync("Press any key to exit...");

Func<int, int, int> add = (a, b) => a + b;

dynamic result = add(5, 10);

// This is a simple lambda expression that adds two integers together. The result is stored in a dynamic variable, which allows for flexibility in the type of the result.
Console.WriteLine($"The result is: {result}");

internal class route
{
    internal static void MapGet(string v, Func<string> value)
    {
        throw new NotImplementedException();
    }
}