1/
declare 
v1 E_client.NOM%Type;
v2 E_client.VILLE%Type;
begin 
select NOM , VILLE into v1 , v2 from E_client where NO=3 ;
DBMS_OUTPUT.PUT_LINE('le nom :'||v1||'la ville : '||v2);
end;

2/
ACCEPT nc PROMPT 'donner le num : ';
declare 
num number :=&nc ;
infos E_client%ROWTYPE;
begin
select* INTO infos from E_client WHERE NO=num;
DBMS_OUTPUT.PUT_LINE('Nom : ' || infos.nom);
DBMS_OUTPUT.PUT_LINE('Adresse : ' || infos.adresse);
DBMS_OUTPUT.PUT_LINE('Téléphone : ' || infos.telephone);
end ;

3/
DECLARE
    CURSOR client_cursor IS SELECT NO, nom, ville FROM E_client;
BEGIN
    FOR client_record IN client_cursor LOOP
        DBMS_OUTPUT.PUT_LINE('Numéro : ' || client_record.NO || ', Nom :
         ' || client_record.nom || ', Ville : ' || client_record.ville);
    END LOOP;
END;

4/

DECLARE
    CURSOR curs IS 
        SELECT NO, NOM 
        FROM E_client 
        WHERE ville LIKE '%rabat%';
BEGIN 
    FOR cur IN curs LOOP
        DBMS_OUTPUT.PUT_LINE('Numéro : ' || cur.NO || ', Nom : ' || cur.NOM);
    END LOOP;
END;





5/
ACCEPT nc NUMBER PROMPT 'donner le num : ';

DECLARE
    client_number NUMBER := &nc;  
    count_clients NUMBER := 0;     
BEGIN
   
    SELECT COUNT(*) INTO count_clients FROM E_client WHERE NO = client_number;

    IF count_clients > 0 THEN
        DBMS_OUTPUT.PUT_LINE(' existe');
    ELSE
        DBMS_OUTPUT.PUT_LINE(' n existe pas');
    END IF;
END;
/


5/
ACCEPT nc NUMBER PROMPT 'donner le num : ';

DECLARE
    client_number NUMBER := &nc;  
    client_found BOOLEAN := FALSE;  
BEGIN
    SELECT CASE 
             WHEN EXISTS (SELECT 1 FROM E_client WHERE NO = client_number) 
             THEN TRUE 
             ELSE FALSE 
           END
    INTO client_found FROM DUAL;

    
    IF client_found THEN
        DBMS_OUTPUT.PUT_LINE(' existe');
    ELSE
        DBMS_OUTPUT.PUT_LINE(' n existe pas');
    END IF;
END;
/



