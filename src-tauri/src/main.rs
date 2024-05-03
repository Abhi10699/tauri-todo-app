#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use sqlite::{self, Connection};
use std::{sync::Mutex, vec};
use tauri;

#[derive(Debug, Serialize, Deserialize)]
struct TodoActivity {
    activity_title: String,
    activity_description: String,
    use_gen_ai: bool,
}

impl TodoActivity {
    fn insert(&self, conn: &Connection) -> Result<bool, String> {
        // insert to db
        let mut query = conn.prepare(
            "INSERT INTO tbl_activities (activity_title, activity_description) VALUES (:title, :description);").unwrap();
        query
            .bind((":title", self.activity_title.as_str()))
            .unwrap();
        query
            .bind((":description", self.activity_description.as_str()))
            .unwrap();

        let state = query.next();
        match state {
            Ok(_) => Ok(true),
            Err(error) => Err(error.message.unwrap()),
        }
    }

    fn fetch_activities(conn: &Connection) -> Vec<TodoActivity> {
        let query = "SELECT * from tbl_activities";
        let mut activities: Vec<TodoActivity> = vec![];
        for row in conn
            .prepare(query)
            .unwrap()
            .into_iter()
            .map(|row| row.unwrap())
        {
            let acitivity = TodoActivity {
                activity_description: row.read::<&str, _>("activity_description").to_string(),
                activity_title: row.read::<&str, _>("activity_title").to_string(),
                use_gen_ai: false,
            };

            activities.push(acitivity);
        }

        activities
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
) -> Result<TodoActivity, String> {
    let todo_activity = TodoActivity {
        activity_description: activity_description.to_string(),
        activity_title: activity_title.to_string(),
        use_gen_ai: false,
    };

    println!("{:?}", todo_activity);
    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    let payload = match todo_activity.insert(conn_ref) {
        Ok(_) => Ok(todo_activity),
        Err(err) => Err(err),
    };
    payload
}

#[tauri::command]
fn get_activities(db_conn: tauri::State<AppState>) -> Vec<TodoActivity> {
    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    let activities = TodoActivity::fetch_activities(conn_ref);
    activities
}

fn main() {
    tauri::Builder::default()
        .manage(AppState(Mutex::new(TodoDb::init())))
        .invoke_handler(tauri::generate_handler![
            greet,
            create_activity,
            get_activities
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
