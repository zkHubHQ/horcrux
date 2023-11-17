program horcrux.aleo {
    // Define a struct to represent a share.
    // Each share consists of a value (share_val) and its corresponding index.
    struct Share {
        share_val: field,
        index: field,
    }

    // This function evaluates a polynomial at a given point (eval_point).
    // It's designed for a degree 2 polynomial.
    // Parameters:
    // - first_coeff: The coefficient of the first degree term.
    // - second_coeff: The coefficient of the second degree term.
    // - eval_point: The point at which the polynomial is evaluated.
    // - secret: The constant term of the polynomial, which represents the secret.
    // Returns the polynomial's value at the given point.
    function evaluate_polynomial(first_coeff: field, second_coeff: field, eval_point: field, secret: field) -> field {
        let y: field = secret;
        let x_pow: field = eval_point;

        y += first_coeff * x_pow;
        x_pow *= eval_point;

        y += second_coeff * x_pow;

        return y;
    }

    // Reconstructs the secret from a given set of shares using Lagrange interpolation.
    // Parameters:
    // - shares: An array of 3 shares used for reconstruction.
    // The function calculates the Lagrange coefficients for each share and sums up their contributions to reconstruct the secret.
    // Returns the reconstructed secret.
    function reconstruct(shares: [Share; 3]) -> field {
        let secret: field = 0field;

        // 1st lagrange coefficient
        let lagrange_coeff: field = 1field;

        let x_i: field = shares[0u8].index;
        let x_j: field = shares[1u8].index;
        lagrange_coeff *= (x_j * (x_j - x_i).inv());

        x_i = shares[0u8].index;
        x_j = shares[2u8].index;
        lagrange_coeff *= (x_j * (x_j - x_i).inv());
    
        secret += ((shares[0u8].share_val) * lagrange_coeff);

        // 1st lagrange coefficient
        lagrange_coeff = 1field;

        x_i = shares[1u8].index;
        x_j = shares[0u8].index;
        lagrange_coeff *= (x_j * (x_j - x_i).inv());

        x_i = shares[1u8].index;
        x_j = shares[2u8].index;
        lagrange_coeff *= (x_j * (x_j - x_i).inv());

        secret += ((shares[1u8].share_val) * lagrange_coeff);

        // 2nd lagrange coefficient
        lagrange_coeff = 1field;

        x_i = shares[2u8].index;
        x_j = shares[0u8].index;
        lagrange_coeff *= (x_j * (x_j - x_i).inv());

        x_i = shares[2u8].index;
        x_j = shares[1u8].index;
        lagrange_coeff *= (x_j * (x_j - x_i).inv());

        secret += ((shares[2u8].share_val) * lagrange_coeff);


        return secret;
    }

    // Splits a secret into shares.
    // Parameters:
    // - secret: The secret to be shared.
    // - first_coeff: The coefficient of the first degree term of the polynomial.
    // - second_coeff: The coefficient of the second degree term of the polynomial.
    // This function evaluates the polynomial at different points (1 to 5) to generate the shares.
    // Returns an array of 5 shares.
    transition split_and_share(secret: field, first_coeff: field, second_coeff: field) -> [Share; 5] {
        // let coefficients: [field; 5] = [secret, ChaCha::rand_field(), ChaCha::rand_field(), ChaCha::rand_field(), ChaCha::rand_field()];
        let shares: [Share; 5] = [
            Share { share_val: evaluate_polynomial(first_coeff, second_coeff, 1field, secret), index: 1field },
            Share { share_val: evaluate_polynomial(first_coeff, second_coeff, 2field, secret), index: 2field },
            Share { share_val: evaluate_polynomial(first_coeff, second_coeff, 3field, secret), index: 3field },
            Share { share_val: evaluate_polynomial(first_coeff, second_coeff, 4field, secret), index: 4field },
            Share { share_val: evaluate_polynomial(first_coeff, second_coeff, 5field, secret), index: 5field }
        ];

        return shares;
    }

    // Transition function to reconstruct the secret from a subset of shares.
    // Parameters:
    // - shares: An array of 3 shares used for reconstruction.
    // Returns the reconstructed secret.
    transition reconstruct_secret(shares: [Share; 3]) -> field {
        let reconstructed_secret: field = reconstruct(shares);
        return reconstructed_secret;
    }
}

/* Things to be improved in Aleo (17th Nov 2023):

1. Cannot access outer loop variables in inner loop
2. No while loop
3. random field element needs to be generated inside finalize function
4. Arrays are immutable
5. Loop iteraions cannot be a variable
6. Finalize is being deprecated, and random field elements only work in finalize
7. Cannot initialize an array with a variable and literals
8. Leo linter does not work well for structs
9. console logging is not supported
10. neq and != not working as expected
*/
