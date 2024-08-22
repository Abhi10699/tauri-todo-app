#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use sqlite::{self, Connection};
use std::{sync::Mutex, vec};
use tauri;

use todo_list::db::{TodoDb, TodoGroup};

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
) -> TodoGroup {
    let mut todo_group = TodoGroup {
        group_description: activity_description.to_string(),
        group_title: activity_title.to_string(),
        id: 0, // find a better way
    };

    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    todo_group.create_group(conn_ref);

    return todo_group;
}

#[tauri::command]
fn get_activities(db_conn: tauri::State<AppState>) -> Vec<TodoGroup> {
    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    let activities = TodoGroup::fetch_all_groups(conn_ref);
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
