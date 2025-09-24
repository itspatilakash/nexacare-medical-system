void main (){
    int input[5] = {-4,-5,-6,7};
    int max = -1;
    for(int i=0;i<sizeof(input);i++){
        if(input[i]>max){
            max = input[i];
        }
    } 
    printf("%d",max);
}