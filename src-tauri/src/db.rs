use serde::{Deserialize, Serialize};
use sqlite::{Connection, State, Statement};
use std::vec;

pub trait Queries {
    fn insert_one() -> Statement<'static>;
}

pub struct TodoDb {
    pub sqlite_conn: Connection,
}
impl TodoDb {
    pub fn init() -> TodoDb {
        let conn = sqlite::open("../tododb.sqlite").expect("Error opening database");
        let _ = conn
            .execute(
                "CREATE TABLE IF NOT EXISTS tbl_todo_group (
               id integer primary key autoincrement,
               group_title text,
               group_description text     
            )",
            )
            .expect("Cannot create activity table");

        let _ = conn
            .execute(
                "
            CREATE TABLE IF NOT EXISTS tbl_todos(
               id integer primary key autoincrement,
               item_title text,
               item_description text,
               group_id integer,
               done numeric,  
               FOREIGN KEY (group_id) REFERENCES tbl_todo_group(id)
            );
        ",
            )
            .expect("error creating activity items table");

        TodoDb { sqlite_conn: conn }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TodoGroup {
    pub id: u32,
    pub group_title: String,
    pub group_description: String,
}
impl TodoGroup {
    pub fn create_group(&mut self, conn: &Connection) {
        let mut query = conn
            .prepare(
                "
          INSERT INTO
               tbl_todo_group (group_title,group_description)
          VALUES 
               (:title,:description);",
            )
            .unwrap();

        query.bind((":title", self.group_title.as_str())).unwrap();
        query
            .bind((":description", self.group_description.as_str()))
            .unwrap();

        // execute quer
        while let Ok(sqlite::State::Row) = query.next() {
            self.id = query.read::<i64, _>("id").unwrap() as u32;
        }
    }

    pub fn fetch_all_groups(conn: &Connection) -> Vec<TodoGroup> {
        let query = conn
            .prepare("SELECT * from tbl_todo_group")
            .unwrap()
            .into_iter()
            .map(|f| f.unwrap());

        let mut all_groups: Vec<TodoGroup> = vec![];
        for result in query {
            let todo_group = TodoGroup {
                group_description: result.read::<&str, _>("group_description").to_string(),
                group_title: result.read::<&str, _>("group_title").to_string(),
                id: result.read::<i64, _>("id") as u32,
            };

            all_groups.push(todo_group);
        }

        all_groups
    }

    pub fn fetch_group_id(group_id: i64, conn: &Connection) -> TodoGroup {
        let query = "SELECT * from tbl_todo_group WHERE id = :id";
        let mut statement = conn.prepare(query).unwrap();
        statement.bind((":id", group_id)).unwrap();

        let mut todo_group = TodoGroup {
            group_description: String::new(),
            id: 0,
            group_title: String::new(),
        };

        let query_state = statement.next();
        match query_state {
            Ok(state) => {
                if (state == State::Row) {
                    todo_group.id = statement.read::<i64, _>("id").unwrap() as u32;
                    todo_group.group_description =
                        statement.read::<String, _>("group_description").unwrap();
                    todo_group.group_title = statement.read::<String, _>("group_title").unwrap();
                }
            }
            Err(err) => {
                panic!("[fetch_group_by_id]: Query Faild")
            }
        };

        todo_group
    }

    pub fn update_group(&self, conn: &Connection) -> Result<bool, String> {
        let query = "UPDATE tbl_todo_group SET group_title=:title, group_description=:description WHERE id=:id";
        let mut statement = conn.prepare(query).unwrap();

        // bind values
        statement.bind((":id", self.id as i64)).unwrap();
        statement
            .bind((":title", self.group_title.as_str()))
            .unwrap();
        statement
            .bind((":description", self.group_description.as_str()))
            .unwrap();

        let update_state = statement.next();

        match update_state {
            Ok(_) => Ok(true),
            Err(err) => Err(err.message).unwrap(),
        }
    }

    pub fn delete_group(group_id: u8) {}
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TodoItem {
    id: u32,
    item_title: String,
    item_description: String,
    group_id: u32,
    done: u8,
}
impl TodoItem {
    pub fn create_item(self, conn: &Connection) -> Result<bool, String> {
        let query = "INSERT INTO tbl_todos (item_title, item_description, done) VALUES(:title, :description, 0)";
        let mut statement = conn.prepare(query).unwrap();
        statement
            .bind((":title", self.item_title.as_str()))
            .unwrap();
        statement
            .bind((":description", self.item_description.as_str()))
            .unwrap();

        let query_state = statement.next();
        match query_state {
            Ok(_) => Ok(true),
            Err(err) => Err(err.message).unwrap(),
        }
    }

    pub fn fetch_all_group_items(group_id: u8, conn: &Connection) -> Vec<TodoItem> {
        let query = "SELECT * FROM tbl_todos WHERE group_id = :id";
        let mut statement = conn.prepare(query).unwrap();
        statement.bind(("id", group_id as i64)).unwrap();
        let rows = statement.into_iter().map(|f| f.unwrap());
        let mut todos: Vec<TodoItem> = vec![];

        for row in rows {
            let todo_item = TodoItem {
                done: row.read::<i64, _>("id") as u8,
                item_title: row.read::<&str, _>("item_title").to_string(),
                item_description: row.read::<&str, _>("item_title").to_string(),
                group_id: row.read::<i64, _>("group_id") as u32,
                id: row.read::<i64, _>("id") as u32,
            };

            todos.push(todo_item);
        }

        todos
    }

    pub fn update_item(item_id: u8, new_item: TodoItem) {}

    pub fn delete_item(item_id: u8) {}

    pub fn change_item_status(item_id: u8, done: u8) {}
}
