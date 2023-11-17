program horcrux.aleo;

struct Share:
    share_val as field;
    index as field;


closure evaluate_polynomial:
    input r0 as field;
    input r1 as field;
    input r2 as field;
    input r3 as field;
    mul r0 r2 into r4;
    add r3 r4 into r5;
    mul r2 r2 into r6;
    mul r1 r6 into r7;
    add r5 r7 into r8;
    mul r6 r2 into r9;
    output r8 as field;


closure reconstruct:
    input r0 as [Share; 3u32];
    sub r0[1u32].index r0[0u32].index into r1;
    inv r1 into r2;
    mul r0[1u32].index r2 into r3;
    mul 1field r3 into r4;
    sub r0[2u32].index r0[0u32].index into r5;
    inv r5 into r6;
    mul r0[2u32].index r6 into r7;
    mul r4 r7 into r8;
    mul r0[0u32].share_val r8 into r9;
    add 0field r9 into r10;
    sub r0[0u32].index r0[1u32].index into r11;
    inv r11 into r12;
    mul r0[0u32].index r12 into r13;
    mul 1field r13 into r14;
    sub r0[2u32].index r0[1u32].index into r15;
    inv r15 into r16;
    mul r0[2u32].index r16 into r17;
    mul r14 r17 into r18;
    mul r0[1u32].share_val r18 into r19;
    add r10 r19 into r20;
    sub r0[0u32].index r0[2u32].index into r21;
    inv r21 into r22;
    mul r0[0u32].index r22 into r23;
    mul 1field r23 into r24;
    sub r0[1u32].index r0[2u32].index into r25;
    inv r25 into r26;
    mul r0[1u32].index r26 into r27;
    mul r24 r27 into r28;
    mul r0[2u32].share_val r28 into r29;
    add r20 r29 into r30;
    output r30 as field;


function split_and_share:
    input r0 as field.private;
    input r1 as field.private;
    input r2 as field.private;
    call evaluate_polynomial r1 r2 1field r0 into r3;
    cast r3 1field into r4 as Share;
    call evaluate_polynomial r1 r2 2field r0 into r5;
    cast r5 2field into r6 as Share;
    call evaluate_polynomial r1 r2 3field r0 into r7;
    cast r7 3field into r8 as Share;
    call evaluate_polynomial r1 r2 4field r0 into r9;
    cast r9 4field into r10 as Share;
    call evaluate_polynomial r1 r2 5field r0 into r11;
    cast r11 5field into r12 as Share;
    cast r4r6r8r10r12 into r13 as [Share; 5u32];
    output r13 as [Share; 5u32].private;


function reconstruct_secret:
    input r0 as [Share; 3u32].private;
    call reconstruct r0 into r1;
    output r1 as field.private;
