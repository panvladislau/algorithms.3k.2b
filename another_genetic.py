import random
from typing import Tuple
import bitstring


def f1(u, w, x, y, z):
    return u ** 1 * w ** 0 * x ** 2 * y ** 2 * z ** 2 + u ** 0 * w ** 0 * x ** 0 * y ** 1 * z ** 0 + u ** 0 * w ** 0 * x ** 1 * y ** 0 * z ** 2 + u ** 0 * w ** 0 * x ** 1 * y ** 2 * z ** 2 + u ** 1 * w ** 2 * x ** 2 * y ** 1 * z ** 2

def f2(u, w, x, y, z):
    return u ** 0 * w ** 1 * x ** 0 * y ** 1 * z ** 0 + u ** 1 * w ** 0 * x ** 2 * y ** 2 * z ** 0 + u ** 1 * w ** 2 * x ** 2 * y ** 0 * z ** 2 + u ** 0 * w ** 2 * x ** 2 * y ** 0 * z ** 1 + u ** 0 * w ** 0 * x ** 0 * y ** 2 * z ** 0

def f3(u, w, x, y, z):
    return u ** 0 * w ** 0 * x ** 0 * y ** 0 * z ** 0 + u ** 0 * w ** 1 * x ** 2 * y ** 1 * z ** 0 + u ** 1 * w ** 1 * x ** 0 * y ** 1 * z ** 1 + u ** 2 * w ** 2 * x ** 0 * y ** 1 * z ** 1 + u ** 0 * w ** 1 * x ** 0 * y ** 0 * z ** 0


def f4(u, w, x, y, z):
    return u ** 2 * w ** 2 * x ** 2 * y ** 0 * z ** 1 + u ** 2 * w ** 0 * x ** 1 * y ** 2 * z ** 0 + u ** 0 * w ** 1 * x ** 1 * y ** 1 * z ** 0 + u ** 0 * w ** 0 * x ** 0 * y ** 1 * z ** 0 + u ** 2 * w ** 0 * x ** 2 * y ** 2 * z ** 0


def f5(u, w, x, y, z):
    return u ** 1 * w ** 0 * x ** 2 * y ** 1 * z ** 1 + u ** 0 * w ** 0 * x ** 1 * y ** 2 * z ** 1 + u ** 1 * w ** 0 * x ** 0 * y ** 0 * z ** 0 + u ** 2 * w ** 1 * x ** 2 * y ** 2 * z ** 2 + u ** 1 * w ** 1 * x ** 2 * y ** 0 * z ** 0


N = 200
ITERATION_NUMBER = 300
BOUNDARY = 200
probability = 0.1


class ErrorWithInfo(Exception):
    def __init__(self, msg: str, **kwargs):
        self.msg = msg
        self.info = kwargs

    def __repr__(self):
        return str(self.msg) + str(self.info)


class Species:
    def __init__(self, target_function, right_result, values=None):
        self.values = values or [random.randint(-BOUNDARY, BOUNDARY) for _ in range(5)]
        self.target_function = target_function
        self.right_result = right_result
        self.fitness = None
        self.calculate_fitness()

    def calculate_fitness(self):
        fidelity = self.target_function(*self.values) - self.right_result
        if fidelity == 0:
            raise ErrorWithInfo("already have answer", solution=self.values)
        self.fitness = abs(1 / fidelity)

    def mutate(self, probability: float):
        for index, gen in enumerate(self.values):
            bitarray = bitstring.BitArray(f"int:16={gen}")
            for i, _ in enumerate(bitarray):
                if random.uniform(0, 1) < probability:
                    bitarray.set(not bitarray[i], i)
            value = normalize(bitarray.int, BOUNDARY)
            self.values[index] = value
        self.calculate_fitness()

def normalize(number, boundary):
    if abs(number) > boundary:
        return abs(number) % boundary * (1 if number > 0 else -1)
    return number

def combine(first_gen: int, second_gen: int, mask: int):
    father_bit = first_gen
    mother_bit = second_gen
    mask2 = ~mask
    first_gen = (father_bit & mask) | (mother_bit & mask2)
    second_gen = (father_bit & mask2) | (mother_bit & mask)
    first_gen = normalize(first_gen, BOUNDARY)
    second_gen = normalize(second_gen, BOUNDARY)
    return first_gen, second_gen


def single_point_combine(first_gen: int, second_gen: int):
    return combine(first_gen, second_gen, int("0b" + "1" * 8 + "0" * 8, 2))


def combine_parents(mother: Species, father: Species) -> Tuple[Species, Species]:
    first_gens = []
    second_gens = []
    for i, father_bit in enumerate(father.values):
        first_gen, second_gen = single_point_combine(father_bit, mother.values[i])
        first_gens.append(first_gen)
        second_gens.append(second_gen)
    return Species(mother.target_function, mother.right_result, values=first_gens), \
           Species(mother.target_function, mother.right_result, values=second_gens)


def sort_generation(generation: list[Species]):
    generation.sort(key=lambda x: x.fitness, reverse=True)


def mutate_generation(generation: list[Species], probability: float) -> None:
    for species in generation:
        species.mutate(probability)


def produce_new_generation(old_generation: list[Species]) -> list[Species]:
    new_generation = []
    random.shuffle(old_generation)
    for i in range(0, len(old_generation), 2):
        new_generation += combine_parents(old_generation[i], old_generation[i + 1])
    sort_generation(new_generation)
    n = len(new_generation) // 2
    mutate_generation(new_generation[n:], probability)
    return new_generation


def next_generation(old_generation: list[Species]):
    fitness_array = [species.fitness for species in old_generation]
    overall_fitness = sum(fitness_array)
    chances = [fitness / overall_fitness for fitness in fitness_array]
    parents = []
    potential_parents = old_generation[:]
    while len(parents) != N:
        parent = random.choices(potential_parents, weights=chances)[0]
        i = potential_parents.index(parent)
        potential_parents.pop(i)
        chances.pop(i)
        parents.append(parent)
    new_generation = produce_new_generation(parents)
    final_generation = new_generation + old_generation
    sort_generation(final_generation)
    return final_generation[:N]


def find_solution(target_function, right_result):
    generation = [Species(target_function, right_result) for _ in range(N)]
    iteration_counter = 0
    try:
        for _ in range(ITERATION_NUMBER):
            generation = next_generation(generation)
            iteration_counter += 1
    except ErrorWithInfo as error:
        return error.info.get("solution"), iteration_counter
    return generation[0].values, iteration_counter


def main() -> None:
    random.seed(9)
    solution, iteration_counter = find_solution(f1, -5)
    print(f"answer is {f1(*solution)}\nsolution is {solution}\niteration number {iteration_counter}\n")
    solution, iteration_counter = find_solution(f2, 40)
    print(f"answer is {f2(*solution)}\nsolution is {solution}\niteration number {iteration_counter}\n")
    solution, iteration_counter = find_solution(f3, -50)
    print(f"answer is {f3(*solution)}\nsolution is {solution}\niteration number {iteration_counter}\n")
    solution, iteration_counter = find_solution(f4, 25)
    print(f"answer is {f4(*solution)}\nsolution is {solution}\niteration number {iteration_counter}\n")
    solution, iteration_counter = find_solution(f5, 40)
    print(f"answer is {f5(*solution)}\nsolution is {solution}\niteration number {iteration_counter}\n")


if __name__ == '__main__':
    main()
