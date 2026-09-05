-- Unifica o expediente padrao em 09:00-19:00, domingo fechado, alinhando o
-- banco ao DEFAULT_OPENING_HOURS do codigo.
-- So altera as linhas que ainda estao com o valor semeado pela migration
-- anterior: expediente ja ajustado pelo barbeiro fica intacto.
UPDATE "OpeningHour"
SET "opensAt" = '09:00', "closesAt" = '19:00', "updatedAt" = CURRENT_TIMESTAMP
WHERE ("weekday", "opensAt", "closesAt") IN (
    (0, '08:00', '18:00'),
    (1, '08:00', '18:00'),
    (2, '08:00', '18:00'),
    (3, '08:00', '18:00'),
    (4, '08:00', '18:00'),
    (5, '08:00', '20:00'),
    (6, '09:00', '16:00')
);
