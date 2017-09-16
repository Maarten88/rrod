using Orleans.CodeGeneration;
using GrainInterfaces;

[assembly: GenerateSerializer(typeof(IncrementCounterAction))]
[assembly: GenerateSerializer(typeof(DecrementCounterAction))]
[assembly: GenerateSerializer(typeof(StartCounterAction))]
[assembly: GenerateSerializer(typeof(CounterStartedAction))]
[assembly: GenerateSerializer(typeof(StopCounterAction))]
[assembly: GenerateSerializer(typeof(CounterStoppedAction))]
[assembly: GenerateSerializer(typeof(SyncCounterStateAction))]
[assembly: GenerateSerializer(typeof(CounterState))]
