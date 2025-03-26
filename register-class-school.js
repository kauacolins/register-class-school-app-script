function iniciarChamada() {
    var idPlanilha = "ID DA AULA"; // Substitua pelo ID correto da planilha
    var ss = SpreadsheetApp.openById(idPlanilha); 
    var sheetAula = ss.getSheetByName("aula");
    var sheetAluno = ss.getSheetByName("aluno");
    var sheetChamada = ss.getSheetByName("chamada");
  
    if (!sheetAula || !sheetAluno || !sheetChamada) {
      Logger.log("❌ Erro: Uma ou mais planilhas não foram encontradas.");
      return;
    }
  
    // Capturar todas as linhas preenchidas da planilha "aula"
    var dadosAula = sheetAula.getDataRange().getValues();
    var ultimaLinhaAula = dadosAula.length;
  
    // Encontrar a última linha realmente preenchida
    while (ultimaLinhaAula > 0 && !dadosAula[ultimaLinhaAula - 1][0]) {
      ultimaLinhaAula--; // Verifica se a coluna "idAula" (coluna 1) está vazia
    }
  
    if (ultimaLinhaAula === 0) {
      Logger.log("❌ Erro: Nenhuma aula preenchida encontrada.");
      return;
    }

    // Capturar turno e idAula da última linha válida
    var linhaAula = dadosAula[ultimaLinhaAula - 1]; // Pegamos direto do array (mais rápido)
    var turnoAula = linhaAula[5]; // Coluna 6 = "turno"
    var idAula = linhaAula[0]; // Coluna 1 = "idAula"
  
    if (!turnoAula || !idAula) {
      Logger.log(`❌ Erro: Não foi possível obter turno ou idAula. turnoAula=${turnoAula}, idAula=${idAula}`);
      return;
    }
  
    turnoAula = turnoAula.toString().trim().toUpperCase(); // Remove espaços extras e coloca em maiúsculas
    Logger.log(`✅ Última aula encontrada - ID: ${idAula}, Turno: ${turnoAula}`);
  
    // Filtrar alunos pelo turno (convertendo para UPPERCASE e removendo espaços)
    var dadosAluno = sheetAluno.getDataRange().getValues();
    var alunosDoTurno = dadosAluno.filter(aluno => 
      aluno[10] && aluno[10].toString().trim().toUpperCase() === turnoAula
    );
  
    if (alunosDoTurno.length === 0) {
      Logger.log(`⚠ Aviso: Nenhum aluno encontrado para o turno ${turnoAula}`);
      return;
    }
  
    Logger.log(`✅ ${alunosDoTurno.length} alunos encontrados no turno ${turnoAula}`);
  
    // Criar chamadas para os alunos do mesmo turno
    var dataHoraAtual = new Date();
    var dataFormatada = Utilities.formatDate(dataHoraAtual, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    var dataApenas = Utilities.formatDate(dataHoraAtual, Session.getScriptTimeZone(), "dd/MM/yyyy");
  
    alunosDoTurno.forEach(aluno => {
      var idChamada = new Date().getTime() + Math.floor(Math.random() * 1000); // Gera um ID único
      var idAluno = aluno[0]; // Supondo que idAluno esteja na coluna 1
  
      sheetChamada.appendRow([
        idChamada,  // ID da chamada gerado
        dataFormatada, // Data e hora atuais
        dataApenas, // Apenas a data
        idAula, // ID da última aula
        idAluno, // ID do aluno filtrado pelo turno
        "Não" // Presença = "Não"
      ]);
    });
  
    Logger.log(`✅ Chamada criada com sucesso para ${alunosDoTurno.length} alunos no turno ${turnoAula}`);
  
    // Atualizar statusChamada para "Fechado" na coluna 9 da linha do idAula
    sheetAula.getRange(ultimaLinhaAula, 9).setValue("Fechado");
    Logger.log(`✅ Status da chamada atualizado para 'Fechado' na linha ${ultimaLinhaAula}`);
  }