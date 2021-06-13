package by.baburin.Main;

import by.baburin.Algorithms.Algorithms;

import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Integer[][] matrix = {
                {Integer.MAX_VALUE, 2, 10, 3, 15, 8},
                {2, Integer.MAX_VALUE, 5, 4, Integer.MAX_VALUE, 6},
                {10, 5, Integer.MAX_VALUE, 15, 12, 3},
                {5, Integer.MAX_VALUE, 15, Integer.MAX_VALUE, 5, 10},
                {15, 2, 12, 5, Integer.MAX_VALUE, Integer.MAX_VALUE},
                {8, 6, 3, 10, 4, Integer.MAX_VALUE}};
        for (Integer[] row:matrix) {
            System.out.println(Arrays.toString(row));
        }

        System.out.println("Floyd");
        matrix = Algorithms.floydAlgorithm(matrix);

        System.out.println("Little's algorithm");
        Algorithms.littleAlgorithm(matrix);
    }
}
