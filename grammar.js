module.exports = grammar({
	name: 'ccl',
	rules: {
		source_file: $ => seq(
			$.functionConstant,
		),
		functionConstant: $ => seq(
			'fun',
			'(',
			$.formalParameterDeclarationPart,
			')',
			$.expressionSequence,
			'endfun'
		),
		formalParameterDeclarationPart: $ => choice('', $.formalParameterDeclarationList),
		formalParameterDeclarationList: $ => choice(
			$.formalParameterDeclaration,
			seq(
				$.formalParameterDeclarationList,
				$.formalParameterDeclaration
			)),
		formalParameterDeclaration: $ => seq(
			$.formalParameterType,
			$.identifier
		),
		formalParameterType: $ => choice(
			$.unqualifiedFormalParameterType,
			seq(
				'immut',
				$.unqualifiedFormalParameterType
			)
		),
		unqualifiedFormalParameterType: $ => choice(
			'triv',
			'int',
			seq('ref', $.formalParameterType),
			seq('ref', 'vec', $.formalParameterType),
			seq('con', $.formalParameterType),
			seq('fun', '(', $.formalParameterTypePart, ')', $.formalParameterType),
		),
		formalParameterTypePart: $ => choice(
			'',
			$.formalParameterTypeList
		),
		formalParameterTypeList: $ => choice(
			$.formalParameterType,
			seq($.formalParameterTypeList, ',', $.formalParameterType)
		),
		expressionSequence: $ => choice(
			$.expression,
			seq(
				$.expressionSequence, ';', $.expression
			)
		),
		expression: $ => choice(
			$.assignmentExpression,
			prec(1, seq(
				$.assignmentExpression,
				'continues',
				$.expression
			)),
		),
		assignmentExpression: $ => choice(
			$.simpleExpression,
			seq($.variableExpression, ':=', $.assignmentExpression)
		),

		// Incomplete as CCL Report mentions
		simpleExpression: $ => choice(
			$.primaryExpression,
			prec.left(3, seq($.simpleExpression, '=', $.simpleExpression)),
			prec.left(3, seq($.simpleExpression, '<>', $.simpleExpression)),
			prec.left(3, seq($.simpleExpression, '<=', $.simpleExpression)),
			prec.left(3, seq($.simpleExpression, '<', $.simpleExpression)),
			prec.left(3, seq($.simpleExpression, '>=', $.simpleExpression)),
			prec.left(3, seq($.simpleExpression, '>', $.simpleExpression)),
			prec.left(4, seq($.simpleExpression, '+', $.simpleExpression)),
			prec.left(4, seq($.simpleExpression, '-', $.simpleExpression)),
			prec.left(5, seq($.simpleExpression, '*', $.simpleExpression)),
			prec.left(5, seq($.simpleExpression, '/', $.simpleExpression)),
			prec.left(6, seq('input', $.variableExpression)),
			prec.left(6, seq('output', $.variableExpression)),
			prec.left(6, seq('+', $.simpleExpression)),
			prec.left(6, seq('-', $.simpleExpression)),
			prec.left(6, seq('#', $.simpleExpression)),
			prec.left(6, seq('&', $.simpleExpression)),
		),
		primaryExpression: $ => choice(
			$.constant,
			$.variableExpression,
			seq('(', $.expressionSequence, ')'),
			prec(7, seq('while', $.expressionSequence, 'do', $.expressionSequence, 'endwhile')),
			prec(7, seq(
				'if',
				$.expressionSequence,
				'then',
				$.expressionSequence,
				'else',
				$.expressionSequence,
				'endif'
			)),
			prec(7,seq(
				'control',
				$.variableExpression,
				'in',
				$.expressionSequence,

			)),
			$.variableBlock,
			prec(7, seq($.primaryExpression, '(', $.actualParameterPart, ')')),
		),
		actualParameterPart: $ => choice('', $.actualParameterList),
		actualParameterList: $ => choice(
			$.expressionSequence,
			seq($.actualParameterList, ',', $.expressionSequence)
		),
		variableExpression: $ => choice(
			$.identifier,
			prec(7, seq($.primaryExpression, '[', $.expressionSequence, ']')),
			prec(7, seq($.primaryExpression, '@')),
		),
		constant: $ => choice(
			$.integerConstant,
			'?',
			$.functionConstant
		),
		variableBlock: $ => prec(7, seq(
			'vars',
			$.variableDeclarationList,
			'in',
			$.expressionSequence,
			'endvars'
		)),
		variableDeclarationList: $ => choice(
			$.variableDeclaration,
			seq(
				$.variableDeclarationList,
				',',
				$.variableDeclaration
			),
		),
		variableDeclaration: $ => seq(
			$.variableType,
			$.identifier
		),
		variableType: $ => choice(
			$.formalParameterType,
			$.unqualifiedVariableType,
			seq('immut', $.unqualifiedVariableType)
		),
		unqualifiedVariableType: $ => seq(
			'vec',
			'[',
			$.expressionSequence,
			']',
			$.variableType
		),
		identifier: () => /[a-z]+/,
		integerConstant: () => /\d+/

	}
});
