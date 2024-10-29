pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimc.circom";

template Hash() {
    signal input secret;
    signal output hash;

    component mimc = MiMC7(91);
    mimc.x_in <== secret;
    mimc.k <== 0;

    hash <== mimc.out;
}

component main = Hash();
