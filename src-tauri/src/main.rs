#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri;

use todo_list::db::{TodoDb, TodoGroup, TodoItem};

struct AppState(Mutex<TodoDb>);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn create_group(
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
fn add_group_item(
    group_id: i64,
    item_title: &str,
    item_description: &str,
    db_conn: tauri::State<AppState>,
) -> TodoItem {
    let mut todo_item = TodoItem {
        item_description: item_description.to_string(),
        item_title: item_title.to_string(),
        id: 0, // find a better way
        group_id: group_id as u32,
        done: 0,
    };

    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    let _ = todo_item.create_item(conn_ref).unwrap();
    todo_item
}

#[tauri::command]
fn get_groups(db_conn: tauri::State<AppState>) -> Vec<TodoGroup> {
    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    let activities = TodoGroup::fetch_all_groups(conn_ref);
    activities
}

#[tauri::command]
fn get_group_items(group_id: i64, db_conn: tauri::State<AppState>) -> Vec<TodoItem> {
    let conn_ref = &db_conn.0.lock().unwrap().sqlite_conn;
    let group_items = TodoItem::fetch_all_group_items(group_id, conn_ref);
    group_items
}

fn main() {
    tauri::Builder::default()
        .manage(AppState(Mutex::new(TodoDb::init())))
        .invoke_handler(tauri::generate_handler![
            greet,
            create_group,
            get_groups,
            get_group_items,
            add_group_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
