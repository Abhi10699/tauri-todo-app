#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlite::{self, Connection, State};
use std::sync::Mutex;
use tauri;

#[derive(Debug)]
struct TodoActivity {
    activity_title: String,
    activity_description: String,
    use_gen_ai: bool,
}

impl TodoActivity {
    fn insert(&self, conn: &Connection) {
        // insert to db
        let mut query = conn.prepare("INSERT INTO tbl_activities (activity_title, activity_description) VALUES (:title, :description);").unwrap();
        query
            .bind((":title", self.activity_title.as_str()))
            .unwrap();
        query
            .bind((":description", self.activity_description.as_str()))
            .unwrap();

        while let Ok(State::Row) = query.next() {
            println!(
                "title = {}",
                query.read::<String, _>("activity_title").unwrap()
            );

            println!(
                "Description = {}",
                query.read::<String, _>("activity_description").unwrap()
            )
        }
    }
}

struct TodoDb {
    sqlite_conn: Connection,
}

impl TodoDb {
    fn init() -> TodoDb {
        // Todo: create db on disk instead of ram
        let conn = sqlite::open("../tododb.sqlite").expect("Error opening database");

        //  create tables

        let _ = conn
            .execute(
                "CREATE TABLE IF NOT EXISTS tbl_activities (
            id integer primary key autoincrement,
            activity_title text,
            activity_description text
        )",
            )
            .expect("Cannot create activity table");

        TodoDb { sqlite_conn: conn }
    }
}

struct AppState(Mutex<TodoDb>);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn create_activity(
    activity_title: &str,
    activity_description: &str,
    db_conn: tauri::State<AppState>,
) {
    let todo_activity = TodoActivity {
        activity_description: activity_description.to_string(),
        activity_title: activity_title.to_string(),
        use_gen_ai: false,
    };

    println!("{:?}", todo_activity);
    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    todo_activity.insert(conn_ref);
}

fn main() {
    tauri::Builder::default()
        .manage(AppState(Mutex::new(TodoDb::init())))
        .invoke_handler(tauri::generate_handler![greet, create_activity])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
