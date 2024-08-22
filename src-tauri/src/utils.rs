use sqlite::Statement;

pub fn insert_one(mut statement: Statement) -> Result<Statement, String> {
    let query_state = statement.next();
    match query_state {
        Ok(_) => Ok(statement),
        Err(err) => Err(err.message).unwrap(),
    }
}
